let joinBtn = $(".joinBtn");
let email = $("#email"); // 이메일
let name = $('#name'); //이름
let phone = $('#phone')//핸드폰번호
let pw = $("#pw"); // 비밀번호
let pwV = $("#pwVal"); // 비밀번호 확인 input

let pwRule = $("span.rule"); // 비밀번호 유효성 검사 문구
let pwSame = $("span.pwSame"); // 비밀번호가 일치o 일치x 문구

let pwValidation = false; // 비밀번호 유효성 검사

// pw 유효성 검사, pw input 값 바뀔 때 계속 검사
pw.on("input", function () {
    pwcheck()

});

// 비밀번호 일치 확인, 일치 input 값 바뀔 때 계속 검사
pwV.on("input", function () {
    pwcheck()

});

// 기존 비밀번호 유효성 검사, 비밀번호 일치 검사 코드 합친 함수
function pwcheck() {
    // ★ 비밀번호 유효성 검사 ★
    let pwVal = pw.val(); // 비밀번호 벨류
    let pwReg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    // 비밀번호 길이 8~16, 영문, 숫자, 특수문자 포함

    if (pwReg.test(pwVal)) { // 만족하면
        pwValidation = true; // 유효성 true
        pw.css("border-bottom", "1px solid blue"); // 파란색 밑줄
        pwRule.css("visibility", "hidden"); // rule 안보이게
    }
    else {
        pwValidation = false; // 만족하지 않으면
        pw.css("border-bottom", "1px solid red"); // 빨간색 밑줄
        pwRule.css("visibility", "visible"); // rule 보이게
    }

    // ★ 비밀번호 일치 검사 ★
    if (pw.val() != pwV.val()) { // 비밀번호가 일치하지 않으면
        pwSame.css("visibility", "visible"); // 일치하지 않습니다 문구 O
        pwV.css("border-bottom", "1px solid red"); // 빨간색 밑줄
    }
    else { // 비밀번호 일치시
        pwSame.css("visibility", "hidden"); // 일치하지 않습니다 문구 X
        pwV.css("border-bottom", "1px solid blue"); // 파란색 밑줄
    }
}

// 회원가입 버튼 클릭 시
joinBtn.click( async function () {
    console.log("check")
    // email이 비어있을 때
    if (email.val() == "") {
        alert("이메일을 입력하세요!!");
        email.focus();
        return false;
    }
    // 이름이 비어있을 때
    if (name.val() == "") {
        alert("이름을 입력하세요!!");
        name.focus();
        return false;
    }
    //핸드폰 번호가 비어있을 때
    if (phone.val() == "") {
        alert("핸드폰번호를 입력하세요!!");
        phone.focus();
        return false;
    }
    // pw가 비어있을 때
    if (pw.val() == "") {
        alert("비밀번호를 입력하세요!!");
        pw.focus();
        return false;
    }
    else {
        // 비밀번호 유효성 검사
        if (!pwValidation) {
            alert("비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자리로 입력해주세요!!");
            pw.focus();
            return false;
        }
    }

    // 비밀번호가 일치하지 않을 때
    if (pw.val() != pwV.val()) {
        alert("비밀번호가 일치하지 않습니다!!");
        pwV.focus();
        return false;
    }

    // 조건 모두 만족시
    try{
        const res = await axios({
            method: 'POST',
            url: '/join',
            data:{
                email: email.val(),
                name: name.val(),
                phone: phone.val(),
                pw: pw.val(),
            },
        });
        console.log(res.data)
        if(res.data.result){
            alert("회원가입이 완료되었습니다!!");
            location.href = "/login";
        }else{
            alert('이미 사용중인 이메일입니다.');
            location.reload();
        }
        

    }catch(error){
        console.log('회원가입 실패',error)
    }

});