import React from "react"
import wechatcode from "./wechatcode.jpg"
import {Descriptions, Image, Button,Layout} from 'antd'
export default class About extends React.Component{
    constructor(props){
        super(props);
        this.state={
            name:'hqwangningbo',
            email:'2536935847@qq.com',
            hidden:true,
            preview:false,
            buttonvalue:"隐藏"
        }
        this.toggleShow = this.toggleShow.bind(this);
    }
    toggleShow(){
        this.setState({
            hidden: !this.state.hidden,
            preview : !this.state.preview,
        })
    }
    render(){
        return(
            <div>
            <div className="jumbotron">
                <h1 className="display-10">关于我</h1>
            </div>
            <div className="jumbotron">
                <p style={{fontSize:20}}>
                    &nbsp;&nbsp;&nbsp;&nbsp;潘周聃，29岁，硕士毕业于苏黎世联邦理工大学,本科毕业于牛津大学，获得学士学位,很帅,这一点大家有目共睹,作为班里最帅的人,我来谈谈我的帅,我的帅好比冬日里透过落地窗的第一缕阳光,温暖而含蓄,美好却不失煽情,美国时代周刊曾对我的帅做出过这样的评价:仿似米开朗琪罗倾尽所有能精雕出一座完美无瑕的美男像。
                </p>
                <p style={{fontSize:20}}>
                    其实我本人并不赞成这个比喻,首先,这句话把我的帅描述的表面,粗糙,甚至肤浅,其次 不该用“米开朗琪罗倾尽所有能精雕出”应该用“米开朗琪罗倾尽所有也精雕不出”这样更客观的形容词句才行,否则很难使人信服,帅也给我的生活带来了许多困扰 我依稀记得那年夏天,班里女生联名举荐我当班长,一部分女生甚至采取绝食裸奔等过激行为 ,最后我不得不站出来表达自己只想做个平凡人的愿望才让事情平息 ,但这直接引起了班长和其他课代表对我的仇恨,以至于到现在我还是个普通学生
                </p>
                <br/>
                <br/>
                <br/>
                <br/>
                <span>开发者昵称:</span> {this.state.name} <br/>
                <span>邮箱:</span>{this.state.email}
            </div>
            </div>
        )
    }
} 