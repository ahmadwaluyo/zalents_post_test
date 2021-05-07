import React, { useState, useEffect } from 'react';
import { 
    Skeleton, 
    Card, 
    Progress, 
    Popover, 
    Col, 
    Space, 
    Tag, 
    Row,
    Modal,
    Form,
    Input,
    InputNumber,
    Button
} from 'antd';
import { 
    EditOutlined, EllipsisOutlined, ArrowRightOutlined, DeleteOutlined,
    PlusCircleOutlined,
    ArrowLeftOutlined
 } from '@ant-design/icons';
 import { connect, useDispatch } from 'react-redux';
 import { getAllTodos, postItem, deleteItem, updateItem, moveLeftItem, moveRightItem } from '../store/actions';
 import FormPage from '../components/Form';

 const token = JSON.parse(localStorage.getItem("isLogin"));

 const colors = [
     'magenta',
     'mediumpurple',
     'blue',
     'lightgreen'
 ]

const CardDetail = ({loading, data, index, postingItems, deletingItems, flagSend, cards}) => {
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const handleAddItems = () => {
        setIsVisible(true);
    }
    const handleClose = () => {
        setIsVisible(false);
    }
    const handlePostItem = (values) => {
        postingItems(token.token, data.id, values);
        setIsVisible(false);
        setTimeout(() => {
            flagSend();
        },1000)
    }
    const handleDeleteItem = (detail) => {
        dispatch(deleteItem(token.token, data.id, detail.id));
        // deletingItems(token.token, data.id, detail.id);
        setTimeout(() => {
            flagSend();
        },1000)
    }
    const handleEditItem = (detail) => {

    }
    const handleMoveRightLeft = (detail, params) => {
        switch(params) {
            case 'right':
                dispatch(moveRightItem(token.token, data.id, {
                    "id": detail.id,
                    "name": detail.name,
                    "progress_percentage": detail.progress_percentage
                }));
                break;
            default:
                dispatch(moveLeftItem(token.token, data.id, {
                    "id": detail.id,
                    "name": detail.name,
                    "progress_percentage": detail.progress_percentage
                }));
                break
        }
    }

    const content = (dataDetail) => {
        return (
            <Space direction="vertical" className="con-card">
                {
                    index === 0 ?
                    <Col className="centered" onClick={() => handleMoveRightLeft(dataDetail, 'right')}><ArrowRightOutlined className="icon" />Move Right</Col> :
                    index === cards.length-1 ?
                    <Col className="centered" onClick={() => handleMoveRightLeft(dataDetail, 'left')}><ArrowLeftOutlined className="icon" />Move Left</Col> :
                    <>
                    <Col className="centered" onClick={() => handleMoveRightLeft(dataDetail, 'right')}><ArrowRightOutlined className="icon" />Move Right</Col>
                    <Col className="centered" onClick={() => handleMoveRightLeft(dataDetail, 'left')}><ArrowLeftOutlined className="icon" />Move Left</Col>
                    </>
                }
                <Col className="centered" onClick={() => setIsVisible(true)}><EditOutlined className="icon" />Edit</Col>
                <Col className="centered" onClick={() => handleDeleteItem(dataDetail)}><DeleteOutlined className="icon" />Delete</Col>
            </Space>
        )
    }

    return (
        <Col lg={6} md={6} xs={12}>
            <Card
            style={{borderColor: colors[index], borderWidth: 1.9, marginBottom: 10}}
            actions={[
                <Row style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}} onClick={handleAddItems}><PlusCircleOutlined key="add" />&nbsp;<span style={{fontSize: 12}}>New Task</span></Row>,
                null,
                null
            ]}
            >
            <Skeleton loading={loading} avatar active>
            <Space direction="vertical">
                <Col>
                    <Tag color={colors[index]}>{data.title}</Tag>
                </Col>
                <Col>
                    <span className="month">{data.description}</span>
                </Col>
            </Space>
            {data.detail && data.detail.length > 0 ?
            data.detail.map((el, i) => 
            (<Card 
            key={i}
            style={{marginTop: 5, padding: 0}}
            className="card-detail"
            actions={[
                <Progress percent={el.progress_percentage || 0} size="small" status="active" style={{width: "60%"}} />,
                <Popover placement="rightTop" content={() => content(el)} trigger="click">
                    <EllipsisOutlined key="ellipsis" />
                </Popover>,
            ]}
            >
                <span className="card-title">{el.name}</span>
            </Card>)
            ) : (<Card 
                style={{marginTop: 5, padding: 0}}
                >
                    <Input placeholder="No Task Available" disabled />
                </Card>)
            }
            </Skeleton>
            </Card>
            {isVisible ?
            <Modal 
            visible={isVisible} 
            onCancel={handleClose} 
            centered 
            title={'Create Task'}
            footer={null}
            >
                <Form onFinish={handlePostItem}>
                    <Form.Item
                    name="name"
                    style={{width: "50%"}}
                    rules={[{ required: true, message: 'Task name must be filled !' }]}
                    >
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <label>Task Name</label>
                            <Input placeholder="example: Build rocket to Mars" />
                        </div>
                    </Form.Item>
                    <Form.Item
                    name="progress_percentage"
                    style={{width: "50%"}}
                    rules={[{ required: true, message: 'Progress must be filled !' }]}
                    >
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <label>Progress</label>
                            <InputNumber placeholder="0%" min={0} max={100}/>
                        </div>
                    </Form.Item>
                    <div
                    style={{
                        textAlign: 'right',
                    }}
                    >
                        <Button onClick={handleClose} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button htmlType="submit" type="primary">
                            Save Task
                        </Button>
                    </div>
                </Form>
            </Modal> : null}
        </Col>
    )
}

function CardPage(props) {
    const [state, setState] = useState({
        loading: true
    });
    const [flagSend, setFlagSend] = useState(false);

    const load = () => {
        props.getAllTodos(token.token);
        setFlagSend(false);
    };

    useEffect(() => {
        console.log(props, "ini props")
        if (props?.cards.length) {
            console.log("dataLoadeds");
        } else {
            load();
        }
    })

    useEffect(() => {
        if (flagSend) {
            load();
        }
    }, [flagSend])

    useEffect(() => {
        setTimeout(() => {
            setState({
                ...state,
                loading: false
            })
        }, 2000)
    }, [state]);

    return (
        <Row gutter={24}>
            {
                props.cards &&
                props.cards.length > 0 ?
                <>
                {props.cards.map((el, i) => 
                    <CardDetail cards={props.cards} postingItems={props.postingItems} reLoad={props.getAllTodos} deletingItems={props.deletingItems} loading={state.loading} data={el} key={i} index={i} flagSend={() => setFlagSend(true)} />
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
        getAllTodos: () => dispatch(getAllTodos(token.token)),
        postingItems: (token, params, body) => dispatch(postItem(token, params, body)),
        deletingItems: (token, paramsTodo, paramsItem) => dispatch(deleteItem(token, paramsTodo, paramsItem))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardPage);