import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ReactNode } from 'react';
import AttackSheetStep from './AttackSheetStep';
import GoBackButton from './GoBackButton';
import AttackAgainButton from './AttackAgainButton';
import GoBackCommand from '../Commands/GoBackCommand';
import AttackAgainCommand from '../Commands/AttackAgainCommand';
import { TestCharacterState } from '../test/fixtures';

// The step shell renders Sheet primitives, which need a Sheet ancestor to mount. The
// buttons are plain buttons, so they render bare.
function renderInSheet(ui: ReactNode) {
	return render(<Sheet open><SheetContent>{ui}</SheetContent></Sheet>);
}

describe('AttackSheetStep', () => {
	it('renders the title, description, body and actions', () => {
		renderInSheet(
			<AttackSheetStep title="Post Damage Roll" description="Confirm final damage rolls" actions={<button>Confirm</button>}>
				<span>body content</span>
			</AttackSheetStep>
		);

		expect(screen.getByText('Post Damage Roll')).toBeInTheDocument();
		expect(screen.getByText('Confirm final damage rolls')).toBeInTheDocument();
		expect(screen.getByText('body content')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
	});

	it('renders without a body', () => {
		renderInSheet(<AttackSheetStep title="Results" description="Attack and Damage Results" actions={<button>Attack Again</button>} />);

		expect(screen.getByText('Results')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Attack Again' })).toBeInTheDocument();
	});
});

describe('GoBackButton', () => {
	it('dispatches a GoBackCommand when clicked', () => {
		const dispatch = vi.fn();
		render(<GoBackButton<TestCharacterState> dispatch={dispatch} />);

		fireEvent.click(screen.getByRole('button', { name: 'Back' }));

		expect(dispatch).toHaveBeenCalledTimes(1);
		expect(dispatch.mock.calls[0][0]).toBeInstanceOf(GoBackCommand);
	});

	it('does not dispatch until clicked', () => {
		const dispatch = vi.fn();
		render(<GoBackButton<TestCharacterState> dispatch={dispatch} />);

		expect(dispatch).not.toHaveBeenCalled();
	});
});

describe('AttackAgainButton', () => {
	it('dispatches an AttackAgainCommand when clicked', () => {
		const dispatch = vi.fn();
		render(<AttackAgainButton<TestCharacterState> dispatch={dispatch} />);

		fireEvent.click(screen.getByRole('button', { name: 'Attack Again' }));

		expect(dispatch).toHaveBeenCalledTimes(1);
		expect(dispatch.mock.calls[0][0]).toBeInstanceOf(AttackAgainCommand);
	});
});
