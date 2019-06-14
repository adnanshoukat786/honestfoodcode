import React, { Component } from 'react';
import {Col  , Container ,  Row , Button} from 'react-bootstrap';
import './app.css';
const axios = require('axios')

export default class App extends Component {

   constructor(props) {
    super(props);
    this.state = {address: ''};
   }

  handleAddress=(event)=> {
    //console.log(event.target.value);
    this.setState({
      address: event.target.value,
      res : '',
    });
  };

  handleSubmit =()=>{
    console.log(this.state.address);
    axios.get('api/getresult?address='+this.state.address).then((res) => {
        console.log(`statusCode: ${res.statusCode}`)
        this.setState({res : res.data})
    }).catch((error) => {
        console.error(error)
    })
  };

  render() {
   // const { username } = this.state;
    return (
      <Container>
      <Col xs="12">
          <Row>
            <Col xs="6">
              <div className="form-group">
                <label htmlFor="couponCode">Please enter address for outlets:</label>
                <input type="text" className="form-control" value={this.state.address} onChange={this.handleAddress} />
              </div>
            </Col>
            
            <Col xs="6">
                <Button className="btn  float-right mt-4 savebtn" onClick={(e) => this.handleSubmit(e)} >Submit</Button>
            </Col>

          </Row>

          <Row>
            <Col xs='12'>
                {this.state.res}
            </Col>
          </Row>
        </Col>
        </Container>
    );
  }
}
