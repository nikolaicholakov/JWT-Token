import * as S from "./elements";
import type { HTMLFooterProps } from "types";

export interface FooterProps extends HTMLFooterProps {}

export const Footer = ({ ...props }: FooterProps) => {
  return <S.Footer {...props}>footer</S.Footer>;
};
