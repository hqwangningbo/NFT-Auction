import React from 'react';

export default class NotFound extends React.Component{

    render(){
        return(
            <div className='jumbotron' style={{textAlign:"center",fontSize:"50px"}}>
                <h1>404 Error</h1>
                <h1>Please Enter The Exact URL</h1>
            </div>
        )
    }
}