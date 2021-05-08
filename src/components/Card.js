import React, { useState, useEffect } from 'react';
import { 
    Col, 
    Row,
} from 'antd';
 import { connect } from 'react-redux';
 import { getAllTodos } from '../store/actions';
 import FormPage from '../components/Form';
 import CardDetail from './CardDetail';

 const token = JSON.parse(localStorage.getItem("isLogin"));
 

function CardPage(props) {
    const [flagSend, setFlagSend] = useState(false);

    const load = () => {
        props.getAllTodos(token.token);
        setFlagSend(false);
    };

    useEffect(() => {
        if (props?.cards.length) {
            console.log("dataLoadeds");
        } else {
            load();
        }
    }, [])

    useEffect(() => {
        if (flagSend) {
            load();
        }
    }, [flagSend])

    return (
        <Row gutter={24}>
            {
                props.cards &&
                props.cards.length > 0 ?
                <>
                {props.cards.map((el, i) => 
                    <CardDetail cards={props.cards} postingItems={props.postingItems} reLoad={props.getAllTodos} deletingItems={props.deletingItems} data={el} key={i} index={i} flagSend={() => setFlagSend(true)} />
                )}
                <Col lg={6} md={6} xs={12}>
                    <FormPage />
                </Col>
                </> :
                <Col lg={6} md={6} xs={12}>
                    <FormPage />
                </Col>
            }
        </Row>
      );
}

const mapStateToProps = (state) => {
    return {
        cards: state.todosReducer.todos
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getAllTodos: () => dispatch(getAllTodos(token.token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardPage);