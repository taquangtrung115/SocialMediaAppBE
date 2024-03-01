import { db } from '../connect.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export const getComments = (req, res) => {
    const q = `select c.*,u.id as userid, u.name, u.profilePic from comments as c JOIN users as u on (u.id = c.userid)
        where c.postid = ? order by c.createAt desc`;
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}

export const addComments = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("not logged in");
    }
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("token not valid");
        const q = "insert into comments (`description`,`createAt`, `userid`, `postid`) values (?)";

        const value = [
            req.body.description,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId
        ];

        db.query(q, [value], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("comment has successfully");
        });
    });
}