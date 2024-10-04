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
  const [filterItem, setfilterItem] = useState("tag");
  const [subCategory, setSubCategory] = useState("");
  const [cateGet, setCateGet] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null); // Store selected data
  const [editSequence, setEditSequence] = useState(""); // Separate state for editing sequence
  const [text, setText] = useState("");
  const [type, setType] = useState("tag");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const contentRes = await axios.get(`${API_URL}/content`);
      const subCategoryRes = await axios.get(`${API_URL}/subcategory`);
      setUserData([
        ...contentRes.data.reverse(),
        ...subCategoryRes.data.reverse(),
      ]);
      const categoryRes = await axios.get(`${API_URL}/content?type=category`);
      const categories = categoryRes.data.map((item) => ({
        key: item._id,
        value: item.text,
        label: item.text,
      }));
      setCateGet(categories);
    } catch (err) {
      console.log("Error fetching data", err);
    }
  };

  const onFilter = () => {
    if (filterItem !== "sub") {
      axios
        .get(`${API_URL}/content?type=${filterItem}`)
        .then((response) => setUserData(response.data))
        .catch((err) => console.log(err));
    } else {
      axios
        .get(`${API_URL}/subcategory`)
        .then((response) => setUserData(response.data.reverse()))
        .catch((err) => console.log(err));
    }
  };

  const onAdd = () => {
    if (type !== "sub") {
      axios
        .post(`${API_URL}/content?id=${localStorage.getItem("id")}`, {
          type,
          text,
          sequence: userData?.length + 1,
        })
        .then(() => {
          message.success("Successfully Added");
          setIsModalOpen(false);
          fetchData();
        })
        .catch((err) => {
          console.log(err);
          message.error("Error adding item");
        });
    } else {
      axios
        .post(`${API_URL}/subcategory`, {
          adminId: localStorage.getItem("id"),
          category: subCategory,
          text,
        })
        .then(() => {
          message.success("Successfully Added");
          setIsModalOpen(false);
          fetchData();
        })
        .catch((err) => {
          console.log(err);
          message.error("Error adding subcategory");
        });
    }
  };

  const onEditSequence = () => {
    axios
      .put(`${API_URL}/content`, {
        id: selectedData?._id,
        sequence: editSequence,
      })
      .then(() => {
        message.success("Successfully Edited");
        setIsEditModalOpen(false);
        setSelectedData(null);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
        message.error("Error editing sequence");
      });
  };

  const handleDeleteTagCategory = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/delete_content/${id}`);
      if (res.data.data.status === 200) {
        message.success(res.data.message);
        fetchData(); // Refresh data after deletion
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log("Error deleting tag/category", error);
      message.error("Error deleting item");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (text, record) => <a>{record._id}</a>,
    },
    {
      title: "Sequence",
      dataIndex: "sequence",
      key: "sequence",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <p>{record.sequence}</p>
          <Space size="middle">
            <a
              onClick={() => {
                setIsEditModalOpen(true);
                setSelectedData(record); // Set selected record
                setEditSequence(record.sequence); // Initialize with current sequence
              }}
            >
              Edit
            </a>
          </Space>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "text",
      key: "text",
    },
    {
      title: filterItem !== "sub" ? "Type" : "Category",
      key: filterItem !== "sub" ? "type" : "category",
      dataIndex: filterItem !== "sub" ? "type" : "category",
      render: (text, record) => (
        <Tag color="geekblue">
          {filterItem !== "sub" ? record.type : record.category}
        </Tag>
      ),
    },
    {
      title: "Delete",
      dataIndex: "_id",
      key: "_id",
      render: (text, record) => (
        <button
          onClick={() => handleDeleteTagCategory(record._id)}
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
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

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
                { value: "tag", label: "By Tag" },
                { value: "category", label: "By Category" },
                { value: "sub", label: "By SubCategory" },
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
                onClick={() => setIsModalOpen(true)}
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
              onChange={(e) => setType(e)}
              value={type}
              style={{ width: "100%", height: 50 }}
              options={[
                { value: "tag", label: "By Tag" },
                { value: "category", label: "By Category" },
                { value: "sub", label: "By SubCategory" },
              ]}
            />
          </Col>
          {type === "sub" && (
            <>
              <Col span={12}>
                <Select
                  placeholder="Category"
                  onChange={(e) => setSubCategory(e)}
                  value={subCategory}
                  style={{ width: "100%", height: 50, marginBottom: 10 }}
                  options={cateGet}
                />
              </Col>
            </>
          )}
          <Col span={12}>
            <Input
              style={{ width: "100%", height: 50 }}
              placeholder="Enter Tag Or Category"
              onChange={(e) => setText(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>

      <Modal
        title="Edit Sequence"
        open={isEditModalOpen}
        onOk={onEditSequence}
        onCancel={handleCancel}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Input
              style={{ width: "100%", height: 50 }}
              value={editSequence} // Reflect current sequence
              placeholder="Sequence"
              onChange={(e) => setEditSequence(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default TagsAndCategory;
