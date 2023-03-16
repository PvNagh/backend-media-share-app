import jwt from "jsonwebtoken";
const secretKey = "405153d89988d00087565e0ec3f6029efdebc882dd4a7f2afe053ebc145ff4d72622d17af6e36089fa972109aca0bef338ad4e1e5e099725b60c847c19ca8f5f";
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.json('token is missing');
    }

    jwt.verify(token, secretKey, (error, verified) => {
        if (error) {
            return res.json('invalid token');
        }
        req.user = verified;
        next();
    })
}