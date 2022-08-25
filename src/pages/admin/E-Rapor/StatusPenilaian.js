import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Navheader from "../../../components/Navheader";
import Appheader from "../../../components/Appheader";
import Adminfooter from "../../../components/Adminfooter";
import { PageHeader, Card, Row, Select, Table, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../../api/Url";
import { getProcessId } from "../../../redux/Action";

function StatusPenilaian() {
  const [statusPenilaian, setStatusPenilaian] = useState([]);
  const [getKelas, setGetKelas] = useState([]);
  const [getTahunAkademik, setGetTahunAkademik] = useState([]);
  const [refreshState, setRefreshState] = useState(false);

  const [selectClass, setSelectClass] = useState([]);
  const [selectAcademic, setSelectAcademic] = useState([]);

  const institute = localStorage.getItem("institute");
  const academic = localStorage.getItem("academic_year");

  const dispatch = useDispatch();
  const getProcess = useSelector((state) => state.processId);
  let ProcessId = getProcess.DataProcess;
  let getKeyGlobalJoin;

  const { Column, ColumnGroup } = Table;

  useEffect(() => {
    dispatch(getProcessId(["globaljoinsubwhereget"]));
  }, []);

  useEffect(() => {
    if (ProcessId.length != 0) {
      setRefreshState(false);

      getKeyGlobalJoin = ProcessId.find(
        (item) => item.key === "globaljoinsubwhereget"
      );
      getKeyGlobalJoin = getKeyGlobalJoin.proses_def_id;

      axios
        .post(
          BASE_URL,
          {
            processDefinitionId: getKeyGlobalJoin,
            returnVariables: true,
            variables: [
              {
                name: "global_join_where_sub",
                type: "json",
                value: {
                  tbl_induk: "x_academic_class",
                  select: [
                    "x_academic_class.id as id_class",
                    "x_academic_class.class",
                    "x_academic_class.sub_class",
                    "x_academic_class.class_location",
                    "x_academic_year.academic_year",
                    "x_academic_year.id as id_academic",
                    "users.name",
                    "x_academic_teachers.id as id_walikelas",
                    "users.institute_id",
                  ],
                  paginate: 1000,
                  join: [
                    {
                      tbl_join: "x_academic_teachers",
                      refkey: "id",
                      tbl_join2: "x_academic_class",
                      foregenkey: "calss_advisor_id",
                    },
                    {
                      tbl_join: "users",
                      refkey: "id",
                      tbl_join2: "x_academic_teachers",
                      foregenkey: "user_id",
                    },
                    {
                      tbl_join: "x_academic_year",
                      refkey: "id",
                      tbl_join2: "x_academic_class",
                      foregenkey: "academic_year_id",
                    },
                  ],
                  where: [
                    {
                      tbl_coloumn: "users",
                      tbl_field: "institute_id",
                      tbl_value: institute,
                      operator: "=",
                    },
                    {
                      tbl_coloumn: "x_academic_class",
                      tbl_field: "academic_year_id",
                      tbl_value: academic,
                      operator: "=",
                      kondisi: "where",
                    },
                    {
                      tbl_coloumn: "x_academic_class",
                      tbl_field: "deleted_at",
                      tbl_value: "",
                      operator: "=",
                      kondisi: "where",
                    },
                  ],
                  order_coloumn: "x_academic_class.updated_at",
                  order_by: "desc",
                },
              },
              {
                name: "page",
                type: "string",
                value: "1",
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          const dataRes = JSON.parse(response?.data?.variables[3]?.value);
          setGetKelas(dataRes?.data?.data);
        });

      axios
        .post(BASE_URL, {
          processDefinitionId:
            "getwherenojoin:3:075dfdd3-f813-11ec-ac5e-66fc627bf211",
          returnVariables: true,
          variables: [
            {
              name: "global_get_where",
              type: "json",
              value: {
                tbl_name: "x_academic_year",
                pagination: true,
                total_result: 10,
                order_coloumn: "x_academic_year.is_active",
                order_by: "desc",
                data: [
                  {
                    kondisi: "where",
                    tbl_coloumn: "institute_id",
                    tbl_value: institute,
                    operator: "=",
                  },
                ],
                tbl_coloumn: ["*"],
              },
            },
            {
              name: "page",
              type: "string",
              value: "1",
            },
          ],
        })
        .then(function (response) {
          // console.log(response);
          const tahunAkademik = JSON.parse(response?.data?.variables[3]?.value);
          setGetTahunAkademik(tahunAkademik?.data);
        });
    }
  }, [ProcessId, refreshState, academic]);

  const getStatusPenilaian = () => {
    console.log(selectAcademic, selectClass);
    setRefreshState(true);
    axios
      .post(BASE_URL, {
        processDefinitionId:
          "eraportstatuspenilaian:1:609c433a-0d58-11ed-ac5e-66fc627bf211",
        returnVariables: true,
        variables: [
          {
            name: "get_data",
            type: "json",
            value: {
              academic_year: selectAcademic,
              id_class: selectClass,
            },
          },
        ],
      })
      .then(function (response) {
        const dataRes = JSON.parse(response?.data?.variables[2]?.value);
        if (dataRes.code == true) {
          console.log("succes", dataRes.data);
          setRefreshState(false);
          setStatusPenilaian(dataRes?.data);
        } else {
          setRefreshState(false);
          setStatusPenilaian([]);
        }
      })
      .catch((error) => {
        console.log(error);
        setRefreshState(false);
      });
  };

  console.log(statusPenilaian);

  const channelList = statusPenilaian.map((data, index) => {
    const pengetahuan =
      data.pengetahuan == false ? (
        <CloseCircleOutlined style={{ color: "red", fontSize: "20px" }} />
      ) : (
        <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />
      );
    const keterampilan =
      data.keterampilan == false ? (
        <CloseCircleOutlined style={{ color: "red", fontSize: "20px" }} />
      ) : (
        <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />
      );
    const sikapSpiritual =
      data.sikap_spirital == false ? (
        <CloseCircleOutlined style={{ color: "red", fontSize: "20px" }} />
      ) : (
        <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />
      );
    const sikapSosial =
      data.sikap_social == false ? (
        <CloseCircleOutlined style={{ color: "red", fontSize: "20px" }} />
      ) : (
        <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />
      );
    const finalisasi =
      data.finalisasi == false ? (
        <CloseCircleOutlined style={{ color: "red", fontSize: "20px" }} />
      ) : (
        <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />
      );
    const deskripsi =
      data.deskripsi == false ? (
        <CloseCircleOutlined style={{ color: "red", fontSize: "20px" }} />
      ) : (
        <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />
      );

    return {
      key: "1",
      no: index + 1,
      mataPelajaran: data.nama_mata_pelajaran,
      namaPendidik: data.nama_pendidik,
      pengetahuan: pengetahuan,
      keterampilan: keterampilan,
      sikapSpiritual: sikapSpiritual,
      sikapSosial: sikapSosial,
      finalisasi: finalisasi,
      deskripsi: deskripsi,
    };
  });

  return (
    <Fragment>
      <div className="main-wrapper">
        <Navheader />
        <div className="main-content">
          <Appheader />
          <div className="container px-3 py-4">
            <PageHeader
              className="mb-3 site-page-header card bg-lightblue text-grey-900 fw-700 "
              onBack={() => window.history.back()}
              title="Status Penilaian"
            />
            <div className="row d-flex align-items-center">
              <div className="col-lg-5">
                <Card className="shadow-md my-6 rounded">
                  <Row>
                    <select
                      style={{ width: "100%" }}
                      name="select_class"
                      className="600 h35"
                      onChange={(e) => setSelectClass(e.target.value)}
                    >
                      <option selected disabled>
                        Pilih Kelas
                      </option>
                      {getKelas.map((data, i) => {
                        return (
                          <>
                            <option value={data.id_class}>
                              {`${data.class} / ${data.sub_class}`}
                            </option>
                          </>
                        );
                      })}
                    </select>
                  </Row>
                </Card>
              </div>
              <div className="col-lg-5">
                <Card className="shadow-md my-6 rounded">
                  <Row>
                    <select
                      style={{ width: "100%" }}
                      name="select_academic"
                      className="w600 h35"
                      onChange={(e) => setSelectAcademic(e.target.value)}
                    >
                      <option selected disabled>
                        Pilih Tahun Akademik / Semester
                      </option>
                      {getTahunAkademik.map((data, i) => {
                        return (
                          <>
                            <option value={data.id}>
                              {`${data.academic_year} / ${data.semester}`}
                            </option>
                          </>
                        );
                      })}
                    </select>
                  </Row>
                </Card>
              </div>
              <div className="col-lg-2">
                <button
                  className="bg-current border-0 text-center text-white font-xs fw-600 p-2 w150 rounded-xl d-inline-block"
                  type="submit"
                  onClick={() => getStatusPenilaian()}
                >
                  Pratinjau
                </button>
              </div>
            </div>
            <Table
              dataSource={channelList}
              className="mt-4"
              align="center"
              pagination={false}
              bordered
            >
              <Column align="center" title="No" dataIndex="no" key="no" />
              <Column
                width="15%"
                title="Mata Pelajaran"
                dataIndex="mataPelajaran"
                key="mataPelajaran"
              />
              <Column
                width="15%"
                title="Nama Pendidik"
                dataIndex="namaPendidik"
                key="namaPendidik"
              />
              <ColumnGroup title="Status Penilaian">
                <Column
                  align="center"
                  title="Pengetahuan"
                  dataIndex="pengetahuan"
                  key="pengetahuan"
                />
                <Column
                  align="center"
                  title="Keterampilan"
                  dataIndex="keterampilan"
                  key="keterampilan"
                />
                <Column
                  align="center"
                  title="Sikap Spiritual"
                  dataIndex="sikapSpiritual"
                  key="sikapSpiritual"
                />
                <Column
                  align="center"
                  title="Sikap Sosial"
                  dataIndex="sikapSosial"
                  key="sikapSosial"
                />
              </ColumnGroup>
              <ColumnGroup title="Status Nilai Rapor">
                <Column
                  align="center"
                  title="Finalisasi"
                  dataIndex="finalisasi"
                  key="finalisasi"
                />
                <Column
                  align="center"
                  title="Deskripsi"
                  dataIndex="deskripsi"
                  key="deskripsi"
                />
              </ColumnGroup>
            </Table>
          </div>
          <Adminfooter />
        </div>
      </div>
    </Fragment>
  );
}

export default StatusPenilaian;
