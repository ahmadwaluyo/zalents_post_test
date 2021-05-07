import React, { useState } from 'react';
import { Drawer, Form, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect, useDispatch } from 'react-redux';
import { postTodo, getAllTodos } from '../store/actions';

const { useForm } = Form;

function DrawerForm (props) {
    const form = useForm();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        visible: false
    })

    const showDrawer = () => {
        setState({
            ...state,
            visible: true,
        });
    };

    const onClose = () => {
        setState({
            ...state,
            visible: false,
        });
    };

    const handleSubmit = (values) => {
        const token = JSON.parse(localStorage.getItem("isLogin"));
        props.postTodo(token.token, values);
        onClose();
        dispatch(getAllTodos(token.token));
        form.resetFields();
    }

    return (
        <>
            <Button type="dashed" block onClick={showDrawer}>
                <PlusOutlined />Add Todos
            </Button>
            <Drawer
            title="Create a new todos"
            onClose={onClose}
            visible={state.visible}
            bodyStyle={{ paddingBottom: 80 }}
            >
                <Form layout="vertical" hideRequiredMark onFinish={handleSubmit}>
                    <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Title must be filled !' }]}
                    >
                    <Input placeholder="Please enter the title" />
                    </Form.Item>
                    <Form.Item
                    name="description"
                    label="Descriptions"
                    rules={[{ required: true, message: 'Descriptions must be filled !' }]}
                    >
                    <Input
                        style={{ width: '100%' }}
                        placeholder="Please enter descriptions"
                    />
                    </Form.Item>
                    <div
                    style={{
                        textAlign: 'left',
                    }}
                    >
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button htmlType="submit" type="primary">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </>
        );
}

const mapDispatchToProps = (dispatch) => {
    return {
        postTodo: (token, body) => dispatch(postTodo(token, body))
    }
}

export default connect(null, mapDispatchToProps)(DrawerForm);

