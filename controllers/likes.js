import { db } from '../connect.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export const getLike = (req, res) => {
    const q = `select userid from likes where postid = ?`;
    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(like => like.userid));
    });
}

export const addLike = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("not logged in");
    }
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("token not valid");
        const q = "insert into likes (`userid`,`postid`) values (?)";

        const value = [
            userInfo.id,
            req.body.postId
        ];

        db.query(q, [value], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("post has been liked successfully");
        });
    });
}

export const deleteLike = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("not logged in");
    }
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("token not valid");
        const q = "delete from likes where `userid` = ? and `postid` = ?";

        const value = [
            userInfo.id,
            req.body.postId
        ];

        db.query(q, [userInfo.id, req.query.postId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("like has been dislike");
        });
    });
}