const {board, comment, like} = require('../models')
const {Op} =require('sequelize')
const Sequelize = require('sequelize')

exports.main = (req, res) => {
    res.render('index');
};

exports.Mypage = (req,res) => {
    res.render('Mypage')
}

///// 게시판 메인페이지
exports.BoardMain = (req,res) => {
    const user = req.session.userName
    let likeArr =[];
    // console.log(user)
    board.findAll().then(result=>{
        console.log(result.boardId)
        for(let i=0; i<result.length ; i++) {
            like.count({
                where: result.boardId[i]
            }).then(cou=>{})
            console.log(cou)
            res.render('CHA_boardMain',{data:result, user})
        }
    })
}

///////게시판 상세페이지
exports.BoardDetail = (req,res) => {
    const user = req.session.userName
    const userid = req.session.userId
  board.findOne({
    where : {BoardId : req.query.boardId} 
}).then(result=>{
    comment.findAll({
        include : [{
            model : board,
        }],where : {boardId:req.query.boardId}
    }).then(commentData => {
        like.count({where:{
            boardId : req.query.boardId
        }}).then(likecount=>{
            res.render('CHA_boardDetail',{data : result,commentData,user,userid,likecount})
        })
    })
    // console.log(result)
})
}

////////게시글 작성
exports.BoardWrite = (req,res) => {
    const {title, date, writer, content} = req.body
    board.create({title, date, writer, content}).then(
        res.json({result:true})
    )
}

////////게시글 삭제
exports.BoardDelete = (req,res) => {
    const {BoardId} = req.body
    console.log(req.body)
    board.destroy({
        where : {BoardId}
    }).then(
        res.send({result:true}))
}

/////////게시글 검색
exports.BoardSearch = async (req, res) => {
    const { searchValue, searchBar } = req.body;
        let result;
        if (searchValue === "title") {
            result = await board.findAll({
                where: { title:{[Op.like]:"%"+searchBar+"%"} }
            })
        } else if (searchValue === "tag") {
            result = await board.findAll({
                where: { tag: {[Op.like]:"%"+searchBar+"%"}}
            });
        } else if (searchValue === "content") {
            result = await board.findAll({
                where: { content: {[Op.like]:"%"+searchBar+"%"} }
            });
        } else {
            // 유효하지 않은 검색 조건일 때 처리
            return res.status(400).send("Invalid searchValue");
        }
        res.send({data:result})
};

//////////////좋아요 기능
exports.BoardLike = (req, res) => {
    const { id,BoardId } = req.body;
    console.log(req.body)
    like.create({BoardId},id).then(result=>{
    })
    }

//////////////댓글 작성
exports.CommentWrite =(req,res) => {
    const {content, writer, date, BoardId} = req.body;
    comment.create({content, writer, date, BoardId}).then(result => {
        console.log(result)
        res.json({result:true})
    })
}