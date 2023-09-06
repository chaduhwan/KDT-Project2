const {board} = require('../models')
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
    board.findAll().then(result=>{
        res.render('CHA_boardMain',{data:result})
    })
}

///////게시판 상세페이지
exports.BoardDetail = (req,res) => {
  board.findOne({
    where : {BoardId : req.query.boardId} 
}).then(result=>{
    // console.log(result)
    res.render('CHA_boardDetail',{data : result})
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
exports.BoardLike = async (req, res) => {
    const { BoardId } = req.body;
    const LikeupdateQuery = {
        like: Sequelize.literal('`like` + 1'), // `like` 칼럼을 1 증가시킵니다.
    };
    board.update(LikeupdateQuery, {
        where: { BoardId }
    }).then(result => {
        // 업데이트가 완료되면 업데이트된 데이터를 다시 조회합니다.
        board.findOne({ where: { BoardId } }).then(updatedData => {
            res.json({ data: updatedData });
        });
    });
}