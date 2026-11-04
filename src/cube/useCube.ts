import { use } from 'react';
import { AppError } from '../errors/AppError.ts';
import { CubeContext, type CubeContextValue } from './CubeContext.ts';

export function useCube(): CubeContextValue {
  const context = use(CubeContext);
  if (!context) throw new AppError('CUBE_PROVIDER_MISSING');
  return context;
}
