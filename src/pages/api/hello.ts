import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { helloSchema } from "schemas";
import { ApiResponseBase } from "types";
import { getToken, JWT } from "next-auth/jwt";

export interface HelloRequest extends NextApiRequest {
  body: { userName: string };
}

export interface HelloResponse {
  message: JWT | null;
}

const handler = nc<HelloRequest, NextApiResponse<ApiResponseBase<HelloResponse>>>({
  onError: (err, req, res, next) => {
    console.log(err.message);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page not found");
  }
}).post(async (req, res) => {
  const token = await getToken({ req });
  console.log("token => ", token);

  return res.status(200).json({ message: token });
});

export default handler;
