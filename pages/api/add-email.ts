import EmailModel from "@/models/emailModel";
import connectDB from "@/utils/connectDB";
import { NextApiRequest, NextApiResponse } from "next";

export default async function AddEmail(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "POST") {
          throw new Error(`${req.method} is an invalid request method.`);
        }

        await connectDB();

        const { email } = req.body;

        if (!email) {
            throw new Error("Email has not been provided.");
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!emailRegex.test(email)) {
            throw new Error("Please provide a valid email.");
        }

        const findEmail = await EmailModel.findOne({ email });
        if (findEmail) {
            throw new Error("This email has already been signed up for the Retrospect waitlist.");
        }

        const newEmail = await EmailModel.create({ email });
        res.status(201).json({ newEmail });

    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
