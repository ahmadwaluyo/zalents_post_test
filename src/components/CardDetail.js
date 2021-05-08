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
 import { postItem, deleteItem, updateItem, moveLeftItem, moveRightItem } from '../store/actions';

const token = JSON.parse(localStorage.getItem("isLogin"));

 const colors = [
     'magenta',
     'mediumpurple',
     'blue',
     'lightgreen'
 ]

const CardDetail = ({data, index, postingItems, deletingItems, flagSend, cards, loadingTodos, updatingItems}) => {
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const [state, setState] = useState({
        name: '',
        progress_percentage: 0,
        id: 0,
        editable: false
    })
    const handleAddItems = () => {
        setIsVisible(true);
    }
    const handleClose = () => {
        setIsVisible(false);
    }
    const handlePostItem = (values) => {
        postingItems(token.token, data.id, values);
        setIsVisible(false);
        flagSend();
    }
    const handleEditItem = (values) => {
        console.log(values, "ini value");
        updatingItems(token.token, data.id, state.id, {
            'name': values.name,
            'target_todo_id': state.id
        });
        setState({
            ...state,
            name: '',
            progress_percentage: 0,
            id: 0,
            editable: false
        })
        setIsVisible(false);
        flagSend();
    }
    const handleDeleteItem = (detail) => {
        deletingItems(token.token, detail.todo_id, detail.id);
        flagSend();
    }
    const validateEdit = (detail) => {
        console.log(detail, "detail");
        setState({
            ...state,
            name: detail.name,
            progress_percentage: +detail.progress_percentage,
            id: detail.id,
            editable: true
        });
        setIsVisible(true);
    }
    const handleMoveRightLeft = (detail, params) => {
        switch(params) {
            case 'right':
                dispatch(moveRightItem(token.token, data.id, {
                    "id": detail.id,
                    "name": detail.name,
                    "progress_percentage": detail.progress_percentage
                }));
                flagSend();
                setTimeout(() => {
                    flagSend();
                }, 1000)
                break;
            default:
                dispatch(moveLeftItem(token.token, data.id, {
                    "id": detail.id,
                    "name": detail.name,
                    "progress_percentage": detail.progress_percentage
                }));
                flagSend();
                setTimeout(() => {
                    flagSend();
                }, 1000)
                break
        }
    }

    useEffect(() => {
        if (loadingTodos) {
            console.log("dataLoadeds");
        } else {
            flagSend();
        }
    }, [])

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
                <Col className="centered" onClick={() => validateEdit(dataDetail)}><EditOutlined className="icon" />Edit</Col>
                <Col className="centered" onClick={() => handleDeleteItem(dataDetail)}><DeleteOutlined className="icon" />Delete</Col>
            </Space>
        )
    }

    return (
        <Col lg={6} md={6} xl={6} xs={24}>
            <Card
            style={{borderColor: colors[index] || 'green', borderWidth: 1.9, marginBottom: 10}}
            actions={[
                <Row style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}} onClick={index === 0 ? handleAddItems : null}>
                    <PlusCircleOutlined key="add" />&nbsp;<span style={{fontSize: 12}}>New Task</span>
                </Row>,
                null,
                null
            ]}
            >
            <Skeleton loading={loadingTodos} avatar active>
            <Space direction="vertical">
                <Col>
                    <Tag color={colors[index] || 'green'}>{data.title}</Tag>
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
                <Popover placement="rightTop" content={() => content(el)} trigger="hover">
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
                <Form onFinish={state.editable ? handleEditItem : handlePostItem}>
                    <Form.Item
                    name="name"
                    style={{width: "50%"}}
                    initialValues={state.name}
                    rules={[{ required: true, message: 'Task name must be filled !' }]}
                    >
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <label>Task Name</label>
                            <Input placeholder="example: Build rocket to Mars" defaultValue={state.name} />
                        </div>
                    </Form.Item>
                    <Form.Item
                    name="progress_percentage"
                    style={{width: "50%"}}
                    rules={[{ required: true, message: 'Progress must be filled !' }]}
                    >
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <label>Progress</label>
                            <InputNumber placeholder="0%" min={0} max={100} defaultValue={state.progress_percentage} />
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
                            {state.editable ? 'Edit' : 'Save'} Task
                        </Button>
                    </div>
                </Form>
            </Modal> : null}
        </Col>
    )
}

const mapStateToProps = (state) => {
    return {
        loadingTodos: state.todosReducer.loadingTodos
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        postingItems: (token, params, body) => dispatch(postItem(token, params, body)),
        deletingItems: (token, paramsTodo, paramsItem) => dispatch(deleteItem(token, paramsTodo, paramsItem)),
        updatingItems: (token, paramsTodo, paramsItem, body) => dispatch(updateItem(token, paramsTodo, paramsItem, body))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardDetail);