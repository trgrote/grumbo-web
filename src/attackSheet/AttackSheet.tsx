import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ComponentType, Dispatch, useEffect, useMemo, useReducer } from "react";
import { CreateInitialState, GetFinalStep } from "./AttackSheetStateFunctions";
import { CreateAttackSheetReducer } from "./AttackSheetStateReducer";
import { AttackSheetState, AttackStep, IAttackSheetCommand, ICharacterAttackModel } from "./AttackSheetTypes";
import ResetCommand from "./Commands/ResetCommand";

// Every step component takes the same two props, which is what lets the sheet look one up
// by step and render it without knowing anything about the character.
export interface AttackStepProps<TCharacterState> {
	state: AttackSheetState<TCharacterState>;
	dispatch: Dispatch<IAttackSheetCommand<TCharacterState>>;
}

// Which component renders which step. Should cover exactly the steps the model declares in
// its `steps` array - a step with no component here renders an empty sheet.
export type AttackStepComponents<TCharacterState> =
	Partial<Record<AttackStep, ComponentType<AttackStepProps<TCharacterState>>>>;

export interface AttackSheetProps<TInfo, TCharacterState> {
	info: TInfo;

	// Builds the character's model from its info. Called again only when `info` changes, so
	// its own identity may vary freely between renders - but it **must be a pure function of
	// `info`**: anything else it closes over is captured once and never refreshed, and a
	// model built from stale values fails silently.
	createModel: (info: TInfo) => ICharacterAttackModel<TCharacterState>;

	steps: AttackStepComponents<TCharacterState>;

	// Fired once when the flow reaches its final step, with the completed state - this is
	// where a character turns that state into a history record and persists it.
	onAttackComplete: (state: AttackSheetState<TCharacterState>) => void;

	// Fired whenever the sheet lands on a step, for side effects a character wants on entry
	// (the Paladin plays a sound on a critical hit). Side effects live here rather than on
	// ICharacterAttackModel, whose methods are pure transforms driven by an injected rng.
	onStepEntered?: (state: AttackSheetState<TCharacterState>) => void;
}

// The whole attack sheet: the trigger, the sliding panel, the reducer wiring, and the
// step-entry/completion effects. A character supplies its model, its step components and
// what to do when an attack finishes.
export default function AttackSheet<TInfo, TCharacterState>({
	info,
	createModel,
	steps,
	onAttackComplete,
	onStepEntered
}: AttackSheetProps<TInfo, TCharacterState>) {
	// `createModel` is deliberately not a dependency: callers pass an inline arrow, so its
	// identity changes every render, and a model rebuilt from unchanged info is equivalent.
	// This is a cost argument, not a correctness one - adding the dep back would only waste a
	// model and reducer allocation per render, since useReducer's initializer runs at mount
	// and the reset below keys on `info`. That reset is what protects an in-flight attack.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const model = useMemo(() => createModel(info), [info]);
	const reducer = useMemo(() => CreateAttackSheetReducer(model), [model]);

	const [state, dispatch] = useReducer(
		reducer,
		model,
		CreateInitialState
	);

	// These effects key on the step alone: they should fire when the flow moves, not on
	// every state change within a step.
	useEffect(() => {
		if (state.attackStep === GetFinalStep(model)) {
			onAttackComplete(state);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.attackStep]);

	useEffect(() => {
		onStepEntered?.(state);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.attackStep]);

	// A step the model declares but the map doesn't cover renders a panel with no header and
	// no controls, whose only exit discards the attack in progress. Nothing in the types
	// catches it, so say so loudly in development.
	useEffect(() => {
		if (!import.meta.env.DEV) {
			return;
		}

		const missing = model.steps.filter(step => !steps[step]);

		if (missing.length > 0) {
			console.error(
				`AttackSheet: the step map has no component for ${missing.map(step => AttackStep[step]).join(', ')}, `
				+ `which the model declares in its steps. The sheet will render an empty panel on those steps.`
			);
		}
	}, [model, steps]);

	const resetSheet = (): void => {
		dispatch(new ResetCommand<TCharacterState>());
	};

	// Keyed on the info, not the memoized model: React doesn't guarantee useMemo keeps its
	// cache, and a dropped one would hand us a fresh model identity on an unrelated re-render
	// and silently reset an attack already in progress.
	useEffect(resetSheet, [info]);

	const StepComponent = steps[state.attackStep];

	return (
		<Sheet onOpenChange={(open) => { if (!open) resetSheet(); }}>
			<SheetTrigger asChild>
				<Button>Roll for Attack</Button>
			</SheetTrigger>
			<SheetContent className="dark bg-background text-neutral-300">
				{StepComponent && <StepComponent state={state} dispatch={dispatch} />}
			</SheetContent>
		</Sheet>
	);
}
