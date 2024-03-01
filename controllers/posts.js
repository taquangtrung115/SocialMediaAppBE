import { db } from '../connect.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export const getPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("not logged in");
    }
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("token not valid");
        const q = `select p.*,u.id as userid, u.name, u.profilePic from posts as p JOIN users as u on (u.id = p.userid)
        left join relationships as r on (p.userid = r.followedUserid) where r.followerUserid = ? or p.userid = ?
        order by createAt desc`;

        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });

}
export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("not logged in");
    }
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("token not valid");
        const q = "insert into posts (`description`,`img`, `userid`, `createAt`) values (?)";

        const value = [
            req.body.description,
            req.body.img,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ];

        db.query(q, [value], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("post has successfully");
        });
    });

}