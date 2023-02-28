// import * as S from "./elements";
// import { useState } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import axios, { AxiosError, AxiosResponse } from "axios";
// import { InferType } from "yup";
// import { useYupValidationResolver } from "utils";
// import { helloSchema } from "schemas";
// import type { HTMLFormProps } from "types";
// import type { HelloRequest, HelloResponse } from "pages/api/hello";

// export type HelloFormValues = InferType<typeof helloSchema>;

// export interface HelloFormProps extends HTMLFormProps {}

// export const HelloForm = ({ ...props }: HelloFormProps) => {
//   const [message, setMessage] = useState<string | null>(null);
//   const [successfulSubmit, setSuccessfulSubmit] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const resolver = useYupValidationResolver(helloSchema);
//   const form = useForm<HelloFormValues>({
//     resolver,
//     defaultValues: {
//       userName: ""
//     }
//   });

//   const { control, handleSubmit } = form;

//   const onSubmit: SubmitHandler<HelloFormValues> = async ({ userName }) => {
//     try {
//       const response = await axios.post<
//         HelloResponse,
//         AxiosResponse<HelloResponse>,
//         HelloRequest["body"]
//       >("/api/hello", { userName });

//       setSuccessfulSubmit(true);
//       setMessage(response.data.message);
//     } catch (error: any) {
//       const axiosError = error as AxiosError;
//       setError(axiosError.response?.data.error || error.message);
//       console.warn(axiosError.response?.data.error || error.message);
//     }
//   };

//   return (
//     <S.Form {...props} onSubmit={handleSubmit(onSubmit)}>
//       {successfulSubmit ? (
//         <S.Title>{message}</S.Title>
//       ) : (
//         <>
//           <S.HeaderText>hello form</S.HeaderText>

//           <S.Title>Contact Us</S.Title>

//           <S.Description>
//             Quickly maximize timely deliverables for real-time maintain schemas.
//           </S.Description>

//           <S.FormInput label={"Your Name (required)"} control={control} name='userName' />

//           <S.Actions>
//             <S.Button variant='primary' type='submit'>
//               Send
//             </S.Button>
//             {error && <S.FormError>{error}</S.FormError>}
//           </S.Actions>
//         </>
//       )}
//     </S.Form>
//   );
// };

export {};
