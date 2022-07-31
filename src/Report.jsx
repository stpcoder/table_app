import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, FieldArray } from "formik";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: "white",
    color: "#546e7a",
    justifyContent: "left",
    padding: "10px 5px",
    fontWeight: "bold"
  },
  content: {
    padding: 0
  },
  status: {
    marginRight: "5px"
  },
  actions: {
    justifyContent: "flex-end"
  },
  summaryTable: {
    width: "auto",
    marginBottom: "10px",
    pointerEvents: "none"
  },
  noBorder: {
    border: "none"
  },
  denseCell: {
    padding: "5px"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

const validationSchema = yup.object().shape({
  data: yup.array().of(
    yup.object().shape({
      code: yup.object().typeError("Please select a code"),
      free: yup.string().required("Please select free option"),
      additionalPrice: yup.string().required("Please enter additional price")
    })
  )
});

const codes = [
  { id: 1, name: "Code 1", desc: "Desc 1", price: 100 },
  { id: 2, name: "Code 2", desc: "Desc 2", price: 200 },
  { id: 3, name: "Code 3", desc: "Desc 3", price: 300 }
];

const freeOptions = ["Yes", "No"];

const initialValues = {
  data: [
    {
      code: null,
      free: "No",
      additionalPrice: 0
    }
  ]
};

const Reports = () => {
  const classes = useStyles();
  const [pushfunction, setFunction] = useState();
  const [newYear, setYear] = useState(new Date().getFullYear());
  const [newMonth, setMonth] = useState(new Date().getMonth() + 1);
  const [newDate, setDate] = useState(new Date().getDate());
  const [fileData, setFileData] = useState("2022 05 27");
  const fs = require("fs");
  const dateCallback = useRef();

  const insertProduct = (push) => {
    const nameing = prompt("인식된 상품의 이름을 입력해주세요");
    var set = fileData.toString();
    var arr = set.split(" ");
    setYear(Number(arr[0]));
    setMonth(Number(arr[1]));
    setDate(Number(arr[2]));
    var dueDate = new Date(arr[0], arr[1], arr[2]);
    dateCallback.current = set;
    var temp = new Date();
    var toDay = new Date(
      temp.getFullYear(),
      temp.getMonth() + 1,
      temp.getDate()
    );
    var one_day = 1000 * 60 * 60 * 24;
    var Result = Math.round(dueDate.getTime() - toDay.getTime()) / one_day;
    var Final_Result = Result.toFixed(0);
    var period1 = "";
    if (Final_Result !== 0) {
      period1 += Final_Result + "일 남았습니다";
    }
    const dateString =
      dueDate.getFullYear().toString() +
      "-" +
      dueDate.getMonth().toString() +
      "-" +
      dueDate.getDate().toString();
    push({
      name: nameing,
      period: period1,
      dueDate: dateString
    });

    function once(fn, context) {
      var result;
      return function () {
        if (fn) {
          result = fn.apply(context || this, arguments);
          fn = null;
        }
        return result;
      };
    }

    var canOnlyFireOnce = once(function () {
      setInterval(() => {
        fs.readFile("../src/date.txt", "utf8", function (err, data) {
          if (data !== dateCallback.current) {
            dateCallback.current = data;
            setFileData(dateCallback);
            const nameing = prompt("인식된 상품의 이름을 입력해주세요");
            var set = data.toString();
            var arr = set.split(" ");
            setYear(Number(arr[0]));
            setMonth(Number(arr[1]));
            setDate(Number(arr[2]));
            var dueDate = new Date(arr[0], arr[1], arr[2]);
            var toDay = new Date();
            var year = (dueDate.getFullYear() - toDay.getFullYear()).toString();
            var month = (
              dueDate.getMonth() -
              (toDay.getMonth() + 1)
            ).toString();
            var date = (dueDate.getDate() - toDay.getDate()).toString();
            if (Number(date) < 0) {
              date = 30 + Number(date);
              month = Number(month) - 1;
            }
            var period1 = "";
            if (year !== "0") {
              period1 = year + "년 ";
            }
            if (month !== "0") {
              period1 += month + "개월 ";
            }
            if (date !== "0") {
              period1 += date + "일 남았습니다";
            }
            if (
              Number(month) < 0 ||
              (Number(month) === 0 && Number(date) === 0)
            ) {
              period1 = "유통기한이 지났습니다";
            }

            const dateString =
              dueDate.getFullYear().toString() +
              "-" +
              dueDate.getMonth().toString() +
              "-" +
              dueDate.getDate().toString();
            push({
              name: nameing,
              period: period1,
              dueDate: dateString
            });
          }
        });
      }, 3000);
    });

    var onceFunction = once(function () {
      setInterval(() => {
        const endFoodArray = [];
        const textArray = document.getElementsByClassName(
          "MuiTableCell-root MuiTableCell-body"
        );
        for (var i = 0; i < textArray.length; i++) {
          if (textArray[i].innerText === "유통기한이 지났습니다") {
            endFoodArray.push(textArray[i]);
          }
        }
        var outputString = "";
        for (var i = 0; i < endFoodArray.length; i++) {
          outputString +=
            endFoodArray[i].parentNode.firstChild.innerText + "\n";
        }
        if (outputString !== "") {
          outputString += "위 상품들의 유통기한이 지났습니다";
          alert(outputString);
        }
      }, 180000);
    });
    onceFunction();
    canOnlyFireOnce();
  };
  return (
    <div>
      <Grid container direction="row">
        <Grid item lg={12} md={12} xs={12}>
          <Card>
            <CardHeader
              className={classes.header}
              title={"유통기한 관리"}
              classes={{
                title: classes.header
              }}
            />
            <Divider />
            <CardContent>
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                  console.log(values.data);
                }}
                validationSchema={validationSchema}
              >
                {({
                  values,
                  handleChange,
                  setFieldValue,
                  errors,
                  handleBlur,
                  touched
                }) => {
                  return (
                    <Form>
                      <FieldArray name="data">
                        {({ insert, remove, push }) => (
                          <Paper>
                            <TableContainer>
                              <Table stickyHeader>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>상품 이름</TableCell>
                                    <TableCell>유통 기한</TableCell>
                                    <TableCell>남은 기한</TableCell>
                                    <TableCell></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {values.data.map((record, idx) => {
                                    return (
                                      <TableRow key={idx} hover>
                                        <TableCell>
                                          {values.data[idx] &&
                                          values.data[idx].name
                                            ? values.data[idx].name
                                            : 0}
                                        </TableCell>
                                        <TableCell>
                                          {values.data[idx] &&
                                          values.data[idx].dueDate
                                            ? values.data[idx].dueDate
                                            : 0}
                                        </TableCell>
                                        <TableCell>
                                          {values.data[idx] &&
                                          values.data[idx].period
                                            ? values.data[idx].period
                                            : 0}
                                        </TableCell>
                                        <TableCell>
                                          <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                              remove(idx);
                                            }}
                                          >
                                            제품 제거
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                  <TableRow>
                                    <TableCell>
                                      <Box>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={() => insertProduct(push)}
                                        >
                                          제품 추가
                                        </Button>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Paper>
                        )}
                      </FieldArray>
                    </Form>
                  );
                }}
              </Formik>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Reports;
