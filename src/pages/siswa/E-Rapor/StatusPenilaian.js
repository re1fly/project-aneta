import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";

import Navheader from "../../../components/Navheader";
import Appheader from "../../../components/Appheader";
import Adminfooter from "../../../components/Adminfooter";
import { PageHeader, Card, Row, Select, Table, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
    eraport_status_penilaian,
    get_where_no_join,
    global_join_sub_where_get,
    url_by_institute
} from "../../../api/reference";

function SiswaStatusPenilaian() {
    const [statusPenilaian, setStatusPenilaian] = useState([]);
    const [getKelas, setGetKelas] = useState([]);
    console.log(getKelas);
    const [getTahunAkademik, setGetTahunAkademik] = useState([]);
    const [refreshState, setRefreshState] = useState(false);

    const [selectClass, setSelectClass] = useState([]);
    console.log(selectClass);
    const [selectAcademic, setSelectAcademic] = useState([]);

    const institute = localStorage.getItem("institute");
    const academic = localStorage.getItem("academic_year");

    const { Column, ColumnGroup } = Table;

    useEffect(() => {
        axios.post(url_by_institute,
            {
                "processDefinitionId": global_join_sub_where_get,
                "returnVariables": true,
                "variables": [
                    {
                        "name": "global_join_where_sub",
                        "type": "json",
                        "value": {
                            "tbl_induk": "x_academic_class",
                            "select": [
                                "x_academic_class.id",
                                "r_class_type.class_type as class",
                                "x_academic_class.sub_class"
                            ],
                            "paginate": false,
                            "join": [
                                {
                                    "tbl_join": "r_class_type",
                                    "refkey": "id",
                                    "tbl_join2": "x_academic_class",
                                    "foregenkey": "class"
                                }
                            ],
                            "where": [
                                {
                                    "tbl_coloumn": "x_academic_class",
                                    "tbl_field": "academic_year_id",
                                    "tbl_value": academic,
                                    "operator": "="
                                }, {
                                    "tbl_coloumn": "x_academic_class",
                                    "tbl_field": "deleted_at",
                                    "tbl_value": "",
                                    "operator": "="
                                }
                            ],
                            "order_coloumn": "x_academic_class.id",
                            "order_by": "asc"
                        }
                    },
                    {
                        "name": "page",
                        "type": "string",
                        "value": "1"
                    }
                ]
            }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic YWRtaW46TWFuYWczciE="
            }
        }
        ).then(function (response) {
            const dataRes = JSON.parse(response?.data?.variables[3]?.value);
            setGetKelas(dataRes?.data);
        })

        axios
            .post(url_by_institute, {
                processDefinitionId: get_where_no_join,
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
                const tahunAkademik = JSON.parse(response?.data?.variables[3]?.value);
                setGetTahunAkademik(tahunAkademik?.data);
            });
    }, [academic, institute]);

    const getStatusPenilaian = () => {
        console.log(selectAcademic, selectClass);
        setRefreshState(true);
        axios
            .post(url_by_institute, {
                processDefinitionId: eraport_status_penilaian,
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

    const channelList = [
        {
            key: "1",
            no: "1",
            mataPelajaran: "Matematika",
            namaPendidik: "Tetsuya",
            pengetahuan: <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />,
            keterampilan: <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />,
            sikapSpiritual: <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />,
            sikapSosial: <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />,
            finalisasi: <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />,
            deskripsi: <CheckCircleOutlined style={{ color: "green", fontSize: "20px" }} />,
        },
    ];

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

export default SiswaStatusPenilaian;
