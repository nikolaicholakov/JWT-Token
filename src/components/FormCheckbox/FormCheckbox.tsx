import * as S from "./elements";
import { useController, UseControllerProps, FieldValues } from "react-hook-form";
import { getRandomIntInclusive } from "utils";
import type { KeyOfType, HTMLInputProps } from "types";

export interface FormCheckboxProps<T extends FieldValues = any>
  extends Omit<HTMLInputProps, "name" | "defaultValue">,
    Omit<UseControllerProps<T>, "name"> {
  name: KeyOfType<T>;
  label?: string;
}

export const FormCheckbox = ({ name, control, label, ...props }: FormCheckboxProps) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields }
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue: ""
  });

  return (
    <S.Container {...props}>
      <S.InputWrapper>
        <S.Input
          {...props}
          type='checkbox'
          spellCheck={false}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          name={name}
          id={name}
          ref={ref}
        />
        {label && <S.Label htmlFor={name}>{label}</S.Label>}
      </S.InputWrapper>
      {error && <S.ErrorText>{error.message}</S.ErrorText>}
    </S.Container>
  );
};

FormCheckbox.displayName = "FormCheckbox";
