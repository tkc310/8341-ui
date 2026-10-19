'use client';

import { createContext, useContext } from 'react';

interface FormFieldContextValue {
  required: boolean;
}

/** FormField が配下の入力部品に渡す値。FormField の外からは使わない */
export const FormFieldContext = createContext<FormFieldContextValue>({ required: false });

/** FormField 配下の入力部品が required を受け取るためのフック */
export const useFormField = () => useContext(FormFieldContext);
