import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { ReactNode } from 'react';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock as any;

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('initializes with default language and currency', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    expect(result.current.language).toBe('ua');
    expect(result.current.currency).toBe('UAH');
  });

  test('loads saved settings from localStorage', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'smf_locale') return 'en';
      if (key === 'smf_currency') return 'USD';
      return null;
    });
    
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    expect(result.current.language).toBe('en');
    expect(result.current.currency).toBe('USD');
  });

  test('changes language and saves to localStorage', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    act(() => {
      result.current.setLanguage('pl');
    });
    
    expect(result.current.language).toBe('pl');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('smf_locale', 'pl');
  });

  test('changes currency and saves to localStorage', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    act(() => {
      result.current.setCurrency('EUR');
    });
    
    expect(result.current.currency).toBe('EUR');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('smf_currency', 'EUR');
  });

  test('translates keys correctly', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    expect(result.current.t('app.title')).toBe('Фінансовий Менеджер');
    
    act(() => {
      result.current.setLanguage('en');
    });
    
    expect(result.current.t('app.title')).toBe('Finance Manager');
  });

  test('formats currency correctly', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    const formatted = result.current.formatCurrency(1234.56);
    expect(formatted).toContain('1234');
    expect(formatted).toContain('₴');
  });

  test('returns key as fallback for missing translations', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    expect(result.current.t('nonexistent.key')).toBe('nonexistent.key');
  });
});