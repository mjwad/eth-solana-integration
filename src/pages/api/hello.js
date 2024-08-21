// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
import { errors } from "../../components/toastGroup"

export const checkAuth = ( async () => {
  await errors();
})();

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
