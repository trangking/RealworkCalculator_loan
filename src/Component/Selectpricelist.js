import {
  Select,
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Card,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import "./Formpicelist.css";
import axios from "axios";
// import Cardpricelist from "./Cardlist";
const Selectpricelist = () => {
  const [typecar, settypercar] = useState([]);
  const [typecarcode, settypecarcode] = useState("");
  const [brand, setbrand] = useState([]);
  const [model, setmodel] = useState([]);
  const [caryear, setcaryear] = useState([]);
  const [modeldetail, setmodeldetail] = useState([]);
  const [modelname, setmodelname] = useState("");
  const [price, setprice] = useState([]);
  const [caryears, setcaryears] = useState("");
  const [modelCode, setModecode] = useState("");
  const [persLeasing, setpersLeasing] = useState("");
  const [loadings, setLoadings] = useState([]);
  const [form] = Form.useForm();
  const [needMoney, setneedMoney] = useState(0);
  const [interestrate, setinterestrate] = useState("");
  const [listAmount, setlistAmount] = useState([]);
  const [dateDayAmount, setdateDayAmount] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);

  const fecthData = async () => {
    try {
      const res = await axios.get("http://localhost:3001/typecar");
      settypercar(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const onChangetypecar = async (value) => {
    try {
      const data = await axios.get(
        ` http://localhost:3001/brand?CAR_TYPE_CODE=${value}`
      );
      settypecarcode(value);
      console.log(typecar);
      setbrand(data.data.resultElements);
      if (typecar !== brand) {
        form.setFieldValue("Car-brand", "เลือกยี่ห้อรถ");
        form.setFieldValue("model-car", "เลือกรุ่นรถ");
        form.setFieldValue("year", "เลือกปีรถ");
        form.setFieldValue("model-detail", "เลือกรุ่นรถ");
        form.setFieldValue("exmple-price", "");
        form.setFieldValue("manageable-amount", "");
      }
    } catch (err) {
      console.log(err);
    }
    // console.log(value);
  };
  const onChangebrand = async (value) => {
    try {
      const data = await axios.get(
        `http://localhost:3001/brand?CAR_TYPE_CODE=${typecarcode}&&BN_CODE=${value}`
      );
      if (brand !== value) {
        form.setFieldValue("model-car", "เลือกรุ่นรถ");
        form.setFieldValue("year", "เลือกปีรถ");
        form.setFieldValue("model-detail", "เลือกรุ่นรถ");
        form.setFieldValue("exmple-price", "");
        form.setFieldValue("manageable-amount", "");
      }
      setmodel(data.data.resultElements2);
    } catch (err) {
      console.log(err);
    }
  };

  const onChangemodel = async (value) => {
    try {
      const data = await axios.get(
        ` http://localhost:3001/year?MD_NAME=${value} `
      );
      setcaryear(data.data);
      setmodelname(value);
      if (model !== value) {
        form.setFieldValue("year", "เลือกปีรถ");
        form.setFieldValue("model-detail", "เลือกรุ่นรถ");
        form.setFieldValue("exmple-price", "");
        form.setFieldValue("manageable-amount", "");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onChangecaryear = async (value) => {
    try {
      const data = await axios.get(
        `     http://localhost:3001/Model_detail?MD_NAME=${modelname}&&CAR_YEAR=${value} `
      );
      setmodeldetail(data.data);
      setcaryears(value);
      if (modeldetail !== value) {
        form.setFieldValue("model-detail", "เลือกรุ่นรถ");
        form.setFieldValue("exmple-price", "");
        form.setFieldValue("manageable-amount", "");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onChangemodeldetail = async (value) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/price?MDDT_CODE=${value}&&CAR_YEAR=${caryears}`
      );
      //เก็บ data ใน arrTotal
      const { arrTotal } = response.data;

      setprice(arrTotal);

      form.setFieldsValue({
        "exmple-price": arrTotal.PRICE,
        "manageable-amount": arrTotal.total,
      });

      console.log(arrTotal);
    } catch (error) {
      console.log(error);
    }
  };
  // const onChangemodeldetail = async (value) => {
  //   try {
  //     const data = await axios.get(
  //       http://localhost:3001/price?MDDT_CODE=${value}&&CAR_YEAR=${caryears}
  //     );
  //     setprice(data.data.arrTotal);
  //     console.log(data.data.arrTotal);
  //         form.setFieldsValue({
  //       "exmple-price": arrTotal.PRICE,
  //       "manageable-amount": arrTotal.total,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const onChangeprice = async (value) => {
    try {
      const data = await axios.get(
        `   http://localhost:3001/persLeasing?MDDT_CODE=${value}&&CAR_YEAR=${caryears}`
      );

      setpersLeasing(data.data);
      console.log(data.data.PERS_LEASING);
    } catch (err) {
      console.log(err);
    }
  };
  const onChangeneedmoney = (value) => {
    setneedMoney(value);
    if (needMoney > price.total) {
      setErrorStatus(true);
      console.log(form);
      form.setFieldsValue({
        needmoney: price.total,
      });
    } else {
      setErrorStatus(false);
    }
  };
  const onChangeinterestrate = (value) => {
    setinterestrate(value);
  };
  const onChangedate = (date, dateString) => {
    setdateDayAmount(dateString);
  };
  const installmentPayment = [
    {
      installmentPayment: 12,
    },
    {
      installmentPayment: 18,
    },
  ];

  const sentToBackend = async () => {
    const convertArr = (exmpleprice) => {
      const exmplepriceInt = exmpleprice.split(" ");
      const exmple = exmplepriceInt[2].replace(/,/g, "");
      return parseFloat(exmple);
    };
    try {
      const requestData = {
        exmpleprice: convertArr(price.PRICE),
        principalAmount: parseFloat(needMoney),
        desiredAmount: parseInt(price.total),
        interestrate: parseFloat(interestrate),
        installmentPayment: parseInt(installmentPayment[0].installmentPayment),
        dateDayAmount: dateDayAmount,
      };

      const res = await axios.post(
        "http://localhost:3001/principalAmount",
        requestData
      );
      setlistAmount(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        sentToBackend();
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
  };
  const onFinish = (e) => {
    console.log(e);
  };
  const onFinishFailed = (e) => {
    console.log(e);
  };
  // const listAmountelements = listAmount.map((listAmount, index) => {
  //   return <Cardpricelist key={index} listAmount={listAmount} />;
  // });
  useEffect(() => {
    fecthData();
  }, []);

  useEffect(() => {
    // const test = "installmentPayment";
    // console.log(installmentPayment[0]);
    // console.log(installmentPayment[0].installmentPayment);
    // console.log(installmentPayment[0][`${test}`]);
    console.log(listAmount);
  }, [listAmount]);

  useEffect(() => {
    console.log(dateDayAmount);
  }, [dateDayAmount]);
  return (
    <div className="formPircelist">
      <Form form={form}>
        <Form.Item label="ประเภทรถ" name="typecar">
          <Select
            showSearch
            style={{ width: 277 }}
            placeholder="เลือกประเภทรถ"
            onChange={onChangetypecar}
          >
            {typecar.map((item, index) => (
              <Select.Option value={item.CAR_TYPE_CODE} key={index}>
                {item.CAR_TYPE_NAME}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div>
          <Form.Item label="ยี่ห้อ" name="Car-brand">
            <Select
              showSearch
              style={{ width: 277 }}
              placeholder="เลือกยี่ห้อรถ"
              onChange={onChangebrand}
            >
              {brand.map((item, index) => (
                <Select.Option value={item.BN_CODE} key={index}>
                  {item.BN_NAME}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item label="รุ่นรถ" name="model-car">
            <Select
              showSearch
              style={{ width: 277 }}
              placeholder="เลือกรุ่นรถ"
              onChange={onChangemodel}
            >
              {model.map((item, index) => (
                <Select.Option value={item.MD_NAME} key={index}>
                  {item.MD_NAME}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item label="ปีรถ(พ.ศ.)" name="year">
            <Select
              showSearch
              style={{ width: 277 }}
              placeholder="เลือกปีรถ"
              onChange={onChangecaryear}
            >
              {caryear.map((item, index) => (
                <Select.Option value={item.CAR_YEAR} key={index}>
                  {item.CAR_YEAR}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item label="โฉม" name="model-detail">
            <Select
              showSearch
              style={{ width: 277 }}
              placeholder="เลือกโฉมรถ"
              onChange={onChangemodeldetail}
            >
              {modeldetail.map((item, index) => (
                <Select.Option value={item.MDDT_CODE} key={index}>
                  {item.MDDT_NAME}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div>
          <Form.Item label="ราคากลาง" name="exmple-price">
            <Input
              value={price.PRICE}
              onChange={onChangeprice}
              style={{ width: 277 }}
              suffix="บาท"
              disabled
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="ยอดที่จัดได้" name="manageable-amount">
            <InputNumber
              value={price.total}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{ width: 277 }}
              suffix="บาท"
              disabled
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            label="วงเงินที่ต้องการ"
            name="needmoney"
            validateStatus={errorStatus ? "error" : ""}
            help={errorStatus ? "วงเงินที่ต้องการต้องไม่เกินยอดรวมทั้งหมด" : ""}
          >
            <InputNumber
              value={needMoney}
              onChange={onChangeneedmoney}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{ width: 277 }}
              suffix="บาท"
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="ดอกเบี้ย" name="startmoney">
            <Select
              value={interestrate}
              className="money"
              style={{ width: 150 }}
              placeholder="เลือกดอกเบี้ย"
              onChange={onChangeinterestrate}
              options={[
                { value: 20, label: "20%" },
                { value: 21, label: "21%", disabled: true },
                { value: 22, label: "22%", disabled: true },
                { value: 23, label: "23%" },
                { value: 24, label: "24%" },
              ]}
            ></Select>
          </Form.Item>
        </div>

        <div>
          <Form.Item label="เลือกวันที่จะชำระเงิน" name="date">
            <DatePicker style={{ width: 270 }} onChange={onChangedate} />
          </Form.Item>
        </div>

        <div>
          <Form.Item>
            <Button
              loading={loadings[0]}
              onClick={() => enterLoading(0)}
              className="buttoncal"
              style={{ width: 180 }}
              type="primary"
            >
              คำนวณ
            </Button>
          </Form.Item>
        </div>
        <div>
          <div>
            <Form.Item>
              {listAmount.map((item, index) => (
                <Card
                  title="Test Card"
                  style={{
                    width: 500,
                  }}
                  key={index}
                >
                  <p>ยอดที่จัดได้{item.desiredAmount}</p>
                  <p>จำนวนที่ต้องการกู้{item.principalAmount}</p>
                  <p>ค่างวด{item.total}</p>
                  <p>ระยะเวลา{item.installmentPayment}</p>
                  <p>ดอกเบี้ย%ต่อปี{item.interestrate}</p>
                </Card>
              ))}
            </Form.Item>
          </div>
          <div>
            <Form.Item></Form.Item>
          </div>
        </div>
      </Form>
      <div>
        {/* <Form.Item>{listAmountelements}</Form.Item> */}
      </div>
    </div>
  );
};

function Selecterpricelist() {
  return <Selectpricelist />;
}
export default Selecterpricelist;
