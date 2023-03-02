import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponseBase } from "types";
import { verify, decode, JwtPayload } from "jsonwebtoken";

export interface HelloRequest extends NextApiRequest {
  body: { userName: string };
}

export interface HelloResponse {
  message: string;
  data?: string | JwtPayload | null;
}

const handler = nc<HelloRequest, NextApiResponse<ApiResponseBase<HelloResponse>>>({
  onError: (err, req, res, next) => {
    console.log(err.message);

    res.status(err.statusCode || 500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page not found");
  }
}).get(async (req, res) => {
  try {
    const token = req.cookies["jwt-auth"] as string;
    console.log("token => ", token);
    const decodedJWT = decode(token);
    console.log("decodedJWT => ", decodedJWT);

    return res.status(200).json({ message: "You are In", data: decodedJWT });
  } catch (error) {
    console.log("error => ", error);
    return res.status(401).json({ message: "You are NOT authorised" });
  }
});

export default handler;
