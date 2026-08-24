import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Dispatch } from 'react';
import AttackSheet, { AttackStepComponents, AttackStepProps } from './AttackSheet';
import AttackSheetStep from './Steps/AttackSheetStep';
import { AttackStep, IAttackSheetCommand } from './AttackSheetTypes';
import CharacterStateCommand from './Commands/CharacterStateCommand';
import ConfirmIsHitCommand from './Commands/ConfirmIsHitCommand';
import ConfirmIsMissCommand from './Commands/ConfirmIsMissCommand';
import RollForAttackCommand from './Commands/RollForAttackCommand';
import { allSteps, buildTestModel, TestCharacterState } from './test/fixtures';

type TestDispatch = Dispatch<IAttackSheetCommand<TestCharacterState>>;

// Changes character state without touching the step, so a step can re-render in place.
class ToggleIsHitCommand extends CharacterStateCommand<TestCharacterState> {
	protected applyToCharacterState(characterState: TestCharacterState): TestCharacterState {
		return { ...characterState, isHit: !characterState.isHit };
	}
}

// Minimal step components, built on the same shell real steps use: each names itself, shows a
// slice of character state so a reset is observable, and offers buttons that drive the flow.
function makeStep(name: string, actions: Record<string, (dispatch: TestDispatch) => void> = {}) {
	return function Step({ state, dispatch }: AttackStepProps<TestCharacterState>) {
		return (
			<AttackSheetStep
				title={name}
				description={`the ${name} step`}
				actions={Object.entries(actions).map(([label, run]) => (
					<button key={label} onClick={() => run(dispatch)}>{label}</button>
				))}
			>
				<span data-testid="step-name">{name}</span>
				<span data-testid="attack-rolls">{JSON.stringify(state.characterState.attackRolls)}</span>
			</AttackSheetStep>
		);
	};
}

// The steps the map below covers. The default model declares exactly these, so a mismatch
// only happens where a test deliberately opts into one.
const coveredSteps = [AttackStep.PreAttackRoll, AttackStep.PostAttackRoll, AttackStep.Results];

const steps: AttackStepComponents<TestCharacterState> = {
	[AttackStep.PreAttackRoll]: makeStep('pre-attack', {
		roll: (d) => d(new RollForAttackCommand<TestCharacterState>(() => 0.5))
	}),
	[AttackStep.PostAttackRoll]: makeStep('post-attack', {
		hit: (d) => d(new ConfirmIsHitCommand<TestCharacterState>()),
		miss: (d) => d(new ConfirmIsMissCommand<TestCharacterState>())
	}),
	[AttackStep.Results]: makeStep('results', {
		touch: (d) => d(new ToggleIsHitCommand())
	})
};

function renderSheet(overrides: Partial<React.ComponentProps<typeof AttackSheet<object, TestCharacterState>>> = {}) {
	const props = {
		info: { id: 'test-info' },
		createModel: () => buildTestModel(coveredSteps),
		steps,
		onAttackComplete: vi.fn(),
		...overrides
	};
	const { rerender } = render(<AttackSheet<object, TestCharacterState> {...props} />);
	return {
		rerenderWith: (next: Partial<typeof props>) =>
			rerender(<AttackSheet<object, TestCharacterState> {...props} {...next} />)
	};
}

const openSheet = () => fireEvent.click(screen.getByRole('button', { name: 'Roll for Attack' }));
const press = (name: string) => fireEvent.click(screen.getByRole('button', { name }));
const currentStep = () => screen.queryByTestId('step-name')?.textContent ?? null;

describe('AttackSheet', () => {
	it('renders the component the step map names for the current step', () => {
		renderSheet();
		openSheet();

		expect(currentStep()).toBe('pre-attack');
	});

	it("swaps to the next step's component as the flow advances", () => {
		renderSheet();
		openSheet();

		press('roll');

		expect(currentStep()).toBe('post-attack');
		expect(screen.getByTestId('attack-rolls')).toHaveTextContent('[0.5]');
	});

	it('renders an empty panel, and warns, on a step the map has no component for', () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
		// This model declares all five steps, so PreDamageRoll onwards have no component.
		renderSheet({ createModel: () => buildTestModel(allSteps) });
		openSheet();
		press('roll');
		press('hit');   // PostAttackRoll -> PreDamageRoll, which the map omits

		expect(currentStep()).toBeNull();
		expect(screen.queryByTestId('attack-rolls')).toBeNull();
		expect(consoleError.mock.calls.flat().join(' ')).toContain('PreDamageRoll');
	});

	it('reports the completed state once the flow reaches its final step', () => {
		const onAttackComplete = vi.fn();
		renderSheet({ onAttackComplete });
		openSheet();

		expect(onAttackComplete).not.toHaveBeenCalled();

		press('roll');
		expect(onAttackComplete).not.toHaveBeenCalled();

		press('miss');   // short-circuits to Results

		expect(onAttackComplete).toHaveBeenCalledTimes(1);
		expect(onAttackComplete.mock.calls[0][0].attackStep).toBe(AttackStep.Results);
		expect(onAttackComplete.mock.calls[0][0].characterState.isHit).toBe(false);
	});

	// Pins the completion effect's dependency on the *step* rather than the whole state:
	// re-rendering within the final step must not report the attack a second time.
	it('does not report again when state changes while already on the final step', () => {
		const onAttackComplete = vi.fn();
		renderSheet({ onAttackComplete });
		openSheet();
		press('roll');
		press('miss');
		expect(onAttackComplete).toHaveBeenCalledTimes(1);

		press('touch');
		press('touch');

		expect(onAttackComplete).toHaveBeenCalledTimes(1);
	});

	it('fires onStepEntered for each step the flow lands on', () => {
		const onStepEntered = vi.fn();
		renderSheet({ onStepEntered });
		openSheet();

		expect(onStepEntered.mock.calls.map(c => c[0].attackStep)).toEqual([AttackStep.PreAttackRoll]);

		press('roll');

		expect(onStepEntered.mock.calls.map(c => c[0].attackStep)).toEqual([
			AttackStep.PreAttackRoll,
			AttackStep.PostAttackRoll
		]);
	});

	it('resets the flow when the sheet is closed and reopened', () => {
		renderSheet();
		openSheet();
		press('roll');
		expect(currentStep()).toBe('post-attack');

		fireEvent.keyDown(document.activeElement || document.body, { key: 'Escape', code: 'Escape' });
		openSheet();

		expect(currentStep()).toBe('pre-attack');
		expect(screen.getByTestId('attack-rolls')).toHaveTextContent('[]');
	});

	// Pins the reset effect keying on `info` rather than the memoized model.
	it('resets mid-flow when the character info changes', () => {
		const { rerenderWith } = renderSheet();
		openSheet();
		press('roll');
		expect(currentStep()).toBe('post-attack');

		rerenderWith({ info: { id: 'edited-info' } });

		expect(currentStep()).toBe('pre-attack');
	});

	// Pins `createModel` being absent from the model memo's dependencies. Callers pass a fresh
	// inline arrow every render; rebuilding the model each time would be wasted allocation.
	// Asserting the *replacement* factory is never invoked is what detects the dep being added
	// back - asserting on the original wouldn't, since the memo would call the new one instead.
	it('does not rebuild the model when only the createModel identity changes', () => {
		const { rerenderWith } = renderSheet();
		openSheet();
		press('roll');

		const nextCreateModel = vi.fn(() => buildTestModel(coveredSteps));
		rerenderWith({ createModel: nextCreateModel });

		expect(nextCreateModel).not.toHaveBeenCalled();
		expect(currentStep()).toBe('post-attack');
	});
});
