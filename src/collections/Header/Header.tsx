import * as S from "./elements";
import type { HTMLHeaderProps } from "types";

export interface HeaderProps extends HTMLHeaderProps {}

export const Header = ({ ...props }: HeaderProps) => {
  return <S.Header {...props}>header</S.Header>;
};
