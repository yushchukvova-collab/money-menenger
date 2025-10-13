import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { AddGoalModal } from '../../components/AddGoalModal';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('AddGoalModal', () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
  };

  beforeEach(() => {
    mockProps.onClose.mockClear();
    mockProps.onSave.mockClear();
  });

  test('renders correctly when open', () => {
    render(<AddGoalModal {...mockProps} />, { wrapper });
    
    expect(screen.getByText('Фінансова ціль')).toBeInTheDocument();
    expect(screen.getByLabelText('Назва цілі*')).toBeInTheDocument();
    expect(screen.getByLabelText('Цільова сума*')).toBeInTheDocument();
    expect(screen.getByLabelText('Дедлайн*')).toBeInTheDocument();
  });

  test('validates required fields', () => {
    render(<AddGoalModal {...mockProps} />, { wrapper });
    
    const submitButton = screen.getByText('Створити');
    fireEvent.click(submitButton);
    
    expect(mockProps.onSave).not.toHaveBeenCalled();
  });

  test('submits form with valid data', () => {
    render(<AddGoalModal {...mockProps} />, { wrapper });
    
    const titleInput = screen.getByLabelText('Назва цілі*');
    const amountInput = screen.getByLabelText('Цільова сума*');
    const deadlineInput = screen.getByLabelText('Дедлайн*');
    const submitButton = screen.getByText('Створити');
    
    fireEvent.change(titleInput, { target: { value: 'Test Goal' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(deadlineInput, { target: { value: '2024-12-31' } });
    fireEvent.click(submitButton);
    
    expect(mockProps.onSave).toHaveBeenCalledWith({
      title: 'Test Goal',
      targetAmount: 1000,
      currentAmount: 0,
      deadline: '2024-12-31'
    });
  });

  test('shows edit mode when editGoal is provided', () => {
    const editGoal = {
      id: '1',
      title: 'Existing Goal',
      targetAmount: 5000,
      currentAmount: 2000,
      deadline: '2024-06-30',
      createdAt: '2024-01-01T00:00:00.000Z'
    };
    
    render(<AddGoalModal {...mockProps} editGoal={editGoal} />, { wrapper });
    
    expect(screen.getByText('Редагувати ціль')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Goal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    expect(screen.getByText('Оновити')).toBeInTheDocument();
  });
});