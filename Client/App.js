import React, { Component } from 'react';
import { Button, Col, Container, Form, FormControl, FormGroup, FormLabel, Row, DropdownButton, Dropdown } from 'react-bootstrap';
import './App.css';
import Table from './Table.js'
import axios from 'axios';

class App extends Component {
  state = {
    insertAttribute: "()",
    removeAttribute: "()",
    updateAttribute: "()",
    insertTableName: "Select Table",
    removeTableName: "Select Table",
    updateTableName: "Select Table",
    viewTableName: "Select Table",
    data: [{}],
    entities: [
      "Branch",
      "Buyer",
      "Car",
      "Car_green",
      "Car_gas",
      "Car_at",
      "Employee",
      "Manages",
      "Purchase",
      "Sell",
      "Work_in"
    ]
  };

  /* handle table name  */
  // for insertTableName
  in = (attr, tab) => { this.setState((state) => { return { insertAttribute: attr, insertTableName: tab } }) };
  // for removeTableName
  rm = (attr, tab) => { this.setState((state) => { return { removeAttribute: attr, removeTableName: tab } }) };
  // for updateTableName
  up = (attr, tab) => { this.setState((state) => { return { updateAttribute: attr, updateTableName: tab } }) };
  // for viewTableName
  view = (attr, tab) => {
    this.setState((state) => { return { viewTableName: tab } });
    this.doSelectRequest(`SELECT * FROM ${tab}`);
  }
  // decide table attribute using tableName
  handleTableName = (param, func) => {
    let attr, tab = param;
    switch (param) {
      case "Branch":
        attr = "(bid, addr, rent)";
        break;
      case "Buyer":
        attr = "(bssn, insurance, bname)";
        break;
      case "Car":
        attr = "(cid, brand, models, car_type)";
        break;
      case "Car_green":
        attr = "(cid, mileage)";
        break;
      case "Car_gas":
        attr = "(cid, fuel_type)";
        break;
      case "Employee":
        attr = "(essn, ename, salary)";
        break;
      case "Purchase":
        attr = "(pid, bssn, cid, price, buy_date, payment_type, payment, price)";
        break;
      case "Sell":
        attr = "(essn, cid, commission)"
        break;
      case "Work_in":
        attr = "(essn, bid, start_date)"
        break;
      case "Manages":
        attr = "(essn, bid, start_date, end_date)";
        break;
      case "Car_at":
        attr = "(bid, cid)"
        break;
      default:
        attr = "()";
        break;
    }
    func(attr, tab);
  }

  onInsert = (e) => {
    e.preventDefault();
    let param = `INSERT INTO ${this.state.insertTableName} ${this.state.insertAttribute} VALUES (${e.target.elements.param.value})`;
    this.doRequest(param, this.state.insertTableName);
  }

  onRemove = (e) => {
    e.preventDefault();
    console.log("onRemove");
    let param = `DELETE FROM ${this.state.removeTableName} WHERE ${e.target.elements.param.value}`;
    this.doRequest(param, this.state.removeTableName);
  }

  onUpdate = (e) => {
    e.preventDefault();
    let param = `UPDATE ${this.state.updateTableName} SET ${e.target.elements.set.value} WHERE ${e.target.elements.param.value}`;
    this.doRequest(param, this.state.updateTableName);
  }

  doRequest = (param, tableName) => {
    axios.get(`http://localhost:9000/q?param=${param}`)
      .then(res => {
        alert(`Queries Executed: ${param}`);
        this.doSelectRequest(`SELECT * FROM ${tableName}`);
      })
      .catch(error => {
        try { alert(JSON.stringify(error.response.data)) }
        catch (err) { console.log(err) }
      })
  };

  select = e => {
    e.preventDefault();
    let param = e.target.elements.param.value.split(/\s/gm).join(" ");
    this.doSelectRequest(param);
  }

  doSelectRequest = param => {
    axios.get(`http://localhost:9000/q?param=${param}`)
      .then(res => {
        this.setState((state) => { return { data: res.data } });
      })
      .catch(error => {
        try { alert(JSON.stringify(error.response.data)) }
        catch (err) { console.log(err) }
      })
  };

  renderDropdownMenu(fn) {
    return this.state.entities.map((entity) => {
      return <Dropdown.Item onClick={() => { this.handleTableName(entity, fn) }}>{entity}</Dropdown.Item>
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Car Dealership Database Management System</h1>
        </header>
        <div className="App-body">
          <Container fluid>
            <Form onSubmit={this.onInsert}>
              <FormGroup as={Row} >
                <FormLabel column md={2} for="param">INSERT INTO</FormLabel>
                <Col md={1} className="col">
                  <DropdownButton variant="outline-dark" id="selectInsertTable" title={this.state.insertTableName}>
                    {this.renderDropdownMenu(this.in)}
                  </DropdownButton>
                </Col>
                <FormLabel column md={2} for="param">{this.state.insertAttribute}</FormLabel>
                <FormLabel column md={1} for="param">VALUES</FormLabel>
                <Col md={4} className="col">
                  <FormControl className="validate" type="text" id="param" name="param" placeholder="Entry...Do Not Enter Paranthese ()" />
                </Col>
                <Col md={1}>
                  <Button type="submit" className="col" variant="success">Confirm</Button>
                </Col>
              </FormGroup>
            </Form>
            <Form onSubmit={this.onRemove}>
              <FormGroup as={Row} >
                <FormLabel column md={2} for="param" >DELETE FROM</FormLabel>
                <Col md={1} className="col">
                  <DropdownButton variant="outline-dark" id="selectRemoveTable" title={this.state.removeTableName}>
                    {this.renderDropdownMenu(this.rm)}
                  </DropdownButton>
                </Col>
                <FormLabel column md={2} for="param">{this.state.removeAttribute}</FormLabel>
                <FormLabel column md={1} for="param">WHERE</FormLabel>
                <Col md={4} className="col">
                  <FormControl className="validate" type="text" id="param" name="param" placeholder="WHERE CONDITION..." />
                </Col>
                <Col md={1}>
                  <Button type="submit" variant="danger" className="col">Confirm</Button>
                </Col>
              </FormGroup>
            </Form>
            <hr />
            <Form onSubmit={this.onUpdate}>
              <FormGroup as={Row} >
                <FormLabel column md={2} >UPDATE</FormLabel>
                <Col md={1} className="col">
                  <DropdownButton variant="outline-dark" id="selectUpdateTable" title={this.state.updateTableName}>
                    {this.renderDropdownMenu(this.up)}
                  </DropdownButton>
                </Col>
                <FormLabel column md={2} for="param">{this.state.updateAttribute}</FormLabel>
                <FormLabel column md={1} for="set" >SET</FormLabel>
                <Col md={4} className="col">
                  <FormControl className="validate" type="text" id="set" name="set" placeholder="SET..." />
                </Col>
              </FormGroup>
              <FormGroup as={Row} className="justify-content-end" >
                <FormLabel column md={1} for="param">WHERE</FormLabel>
                <Col md={4} className="col">
                  <FormControl className="validate" type="text" id="param" name="param" placeholder="WHERE..." />
                </Col>
                <Col md={1} style={{ marginRight: "3rem", }}>
                  <Button type="submit" variant="info" className="col" >Confirm</Button>
                </Col>
              </FormGroup>
            </Form>
            <hr />
            <Form onSubmit={this.select}>
              <FormGroup as={Row} >
                <FormLabel column md={2} for="param">SELECT QUERIES</FormLabel>
                <Col>
                  <FormControl as="textarea" rows="4" type="text" id="param" name="param" placeholder="Enter Select Queries..." />
                </Col>
                <Col md={1} style={{ marginRight: "2rem", }}>
                  <Button type="submit" variant="info">Confirm</Button>
                </Col>
              </FormGroup>
            </Form>
            <hr />
            <Row>
              <FormLabel column md={2} for="param">VIEW TABLE</FormLabel>
              <Col md={1}>
                <DropdownButton variant="outline-dark" id="selectViewTable" title={this.state.viewTableName}>
                  {this.renderDropdownMenu(this.view)}
                </DropdownButton>
              </Col>
              <Col md={1} />
              <Col>
                <Table data={this.state.data} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default App;