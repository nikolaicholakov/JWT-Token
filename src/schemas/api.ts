import { object, string } from "yup";

export const helloSchema = object({
  userName: string().required("User Name field is required.")
});
