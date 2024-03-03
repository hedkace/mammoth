const html = `
    <h1>Hellow World</h1>
    <p>It's Nodemailer useful?</p>
`

async main = ()=>{
    const transporter = nodemailer.createTransport({
        host: //mail server,
        port: 465,
        secure: true,
        auth: {
            user: 'test',
            pass: 'password'
        }
    })

    const info = await transporter.sendMail({
        from: 'Mammath <admin@mammoth.com>',
        to: 'bob@bobmail.net',
        subject: 'Yo!',
        html: html
    })

    console.log("message sent: " + info.messageId)
}

main()
.catch(e=> console.log(e))