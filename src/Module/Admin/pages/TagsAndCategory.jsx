import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../API";

const TagsAndCategory = () => {
  const [userData, setUserData] = useState([]);
  const [filterItem, setfilterItem] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [cateGet, setCateGet] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(null);
  const [editData, setEditData] = useState(null);

  const [text, setText] = useState("");
  const [type, settype] = useState("tag");
  useEffect(() => {
    axios
      .get(`${API_URL}/content`)
      .then((users) => {
        axios
          .get(`${API_URL}/subcategory`)
          .then((sub) => {
            setUserData([...users.data.reverse(), ...sub.data.reverse()]);
            console.log(users);
          })
          .catch((err) => {
            console.log("err=>>>", err);
          });
        // setUserData(users.data.reverse());
        // console.log(users);
      })
      .catch((err) => {
        console.log("err=>>>", err);
      });
    axios
      .get(`${API_URL}/content?type=category`)
      .then((content) => {
        let arr = [];
        for (let i = 0; i < content.data.length; i++) {
          const element = content.data[i];
          arr.push({
            key: element._id,
            value: element.text,
            label: element.text,
          });
        }
        setCateGet(arr);
        // console.log(users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onFilter = () => {
    console.log(filterItem);
    if (filterItem != "sub") {
      axios
        .get(`${API_URL}/content?type=${filterItem}`)
        .then((users) => {
          setUserData(users.data);
          console.log(users);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(`${API_URL}/subcategory`)
        .then((users) => {
          setUserData(users.data.reverse());
          console.log(users);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const onAdd = () => {
    if (type != "sub") {
      axios
        .post(`${API_URL}/content?id=${localStorage.getItem("id")}`, {
          type: type,
          text: text,
          sequence: userData?.length + 1,
        })
        .then((users) => {
          // setUserData([users.data.data,...userData]);
          message.success("Successfully Added");
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.log(err);
          message.error("Successfully Not Added");
          setIsModalOpen(false);
        });
    } else {
      axios
        .post(`${API_URL}/subcategory`, {
          adminId: localStorage.getItem("id"),
          category: subCategory,
          text: text,
        })
        .then((users) => {
          setUserData(users.data.data);
          message.success("Successfully Added");
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.log(err);
          message.error("Successfully Not Added");
          setIsModalOpen(false);
        });
    }
  };

  const onEditSequence = () => {
    axios
      .put(`${API_URL}/content`, {
        id: isEditModalOpen?._id,
        sequence: editData ? editData : isEditModalOpen?.sequence,
      })
      .then((users) => {
        // setUserData([users.data.data,...userData]);
        message.success("Successfully Edited");
        setIsEditModalOpen(null);
      })
      .catch((err) => {
        console.log(err);
        message.error("Successfully Not Edited");
        setIsEditModalOpen(null);
      });
  };
  const handleDeleteTagCategory = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/delete_content/${id}`);
      console.log("tag&category delete api response : ", res);
      if (res.data.data.status === 200) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log("error is delete tag&category : ", error);
      message.error(error.response);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (_, { _id }) => <a>{_id}</a>,
    },
    {
      title: "Sequence",
      dataIndex: "sequence",
      key: "sequence",
      render: (_, data) => {
        console.log(data, "kk");
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <p color="geekblue">{data.sequence}</p>
            <Space size="middle">
              <a onClick={() => setIsEditModalOpen(data)}>edit</a>
            </Space>
          </div>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "text",
      key: "text",
    },
    {
      title: filterItem != "sub" ? "Type" : "Category",
      key: filterItem != "sub" ? "category" : "type",
      dataIndex: filterItem != "sub" ? "category" : "type",
      render: (_, data) => {
        console.log(data, "kk");
        return (
          <>
            <Tag color="geekblue">
              {filterItem != "sub" ? data.type : data.category}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "_id",
      key: "_id",
      render: (_, { _id }) => {
        console.log("id in delete tag & category: ", _id);
        return (
          <button
            onClick={() => handleDeleteTagCategory(_id)}
            style={{
              padding: "3px 8px",
              backgroundColor: "#fadcd9",
              color: "red",
              font: "message-box",
              borderRadius: "5px",
              cursor: "pointer",
              border: "1px solid red",
            }}
          >
            Delete
          </button>
        );
      },
    },
  ];
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  console.log("UD", userData);

  return (
    <>
      <h1
        style={{
          color: "rgba(0,0,0,0.8)",
          marginBottom: 10,
          textAlign: "left",
          fontFamily: "Poppins",
        }}
      >
        Tags & Category
      </h1>
      <Card style={{ height: "100%" }}>
        <Row gutter={20}>
          <Col span={6}>
            <Select
              style={{ width: "100%" }}
              defaultValue="tag"
              onChange={(e) => setfilterItem(e)}
              options={[
                {
                  value: "tag",
                  label: "By Tag",
                },
                {
                  value: "category",
                  label: "By Category",
                },
                {
                  value: "sub",
                  label: "By SubCategory",
                },
              ]}
            />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={onFilter}>
              Filter
            </Button>
            <Space style={{ marginLeft: 10 }}>
              <Button
                type="primary"
                style={{ backgroundColor: "green" }}
                onClick={showModal}
              >
                Add
              </Button>
            </Space>
          </Col>
          <Col span={24} style={{ marginTop: 20 }}>
            <Table columns={columns} dataSource={userData} />
          </Col>
        </Row>
      </Card>
      <Modal
        title="Select Category"
        open={isModalOpen}
        onOk={onAdd}
        onCancel={handleCancel}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Select
              onChange={(e) => settype(e)}
              value={type}
              style={{
                width: "100%",
                height: 50,
              }}
              options={[
                {
                  value: "tag",
                  label: "By Tag",
                },
                {
                  value: "category",
                  label: "By Category",
                },
                {
                  value: "sub",
                  label: "By SubCategory",
                },
              ]}
            />
          </Col>
          {type == "sub" && (
            <>
              <Col span={12}>
                <Select
                  placeholder="Category"
                  onChange={(e) => setSubCategory(e)}
                  value={subCategory ? subCategory : null}
                  style={{
                    width: "100%",
                    height: 50,
                    marginBottom: 10,
                  }}
                  options={cateGet}
                />
              </Col>
              <Col span={12}></Col>
            </>
          )}
          <Col span={12}>
            <Input
              style={{
                width: "100%",
                height: 50,
              }}
              placeholder="Enter Tag Or Cateogry"
              onChange={(e) => setText(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>

      <Modal
        title="Edit Sequence"
        open={isEditModalOpen == null ? false : true}
        onOk={onEditSequence}
        onCancel={() => setIsEditModalOpen(null)}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Input
              style={{
                width: "100%",
                height: 50,
              }}
              defaultValue={isEditModalOpen?.sequence}
              placeholder="Sequence"
              onChange={(e) => setEditData(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default TagsAndCategory;
