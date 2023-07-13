import React, { Fragment, useState, useEffect } from "react"
import {
    Card,
    PageHeader, Spin
} from "antd";
import {
    AppstoreOutlined,
    MenuOutlined,
} from "@ant-design/icons";

import { Link, useHistory, useParams } from 'react-router-dom';
import axios from "axios";
import Search from "antd/es/input/Search";
import Adminfooter from '../../../components/Adminfooter';
import Navheader from '../../../components/Navheader';
import Appheader from '../../../components/Appheader';
import { role_siswa_get_nilai_materi, url_by_institute } from "../../../api/reference";

export default function SiswaNilaiTugas() {
    const [grid, setGrid] = useState(false);
    const [getMateri, setGetMateri] = useState([]);

    const userId = localStorage.getItem('user_id');
    const academicYear = localStorage.getItem('academic_id');
    const instituteId = localStorage.getItem('institute');

    const [loading, setLoading] = useState(true);
    const [countRender, setCountRender] = useState(0)
    const [dataSuccess, setDataSuccess] = useState(false)

    const params = useParams();
    const path = params.id.split("-");
    const idMapel = path[0];
    const mapel = path[1];

    const _onSearch = value => console.log(value);

    const _getTugas = () => {
        axios.post(url_by_institute,
            {
                "processDefinitionId": role_siswa_get_nilai_materi,
                "returnVariables": true,
                "variables": [
                    {
                        "name": "data",
                        "type": "json",
                        "value": {
                            "id_user": userId,
                            "id_academic": academicYear,
                            "id_matpel": idMapel
                        }
                    }
                ]
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic YWRtaW46TWFuYWczciE="
                }
            }
        ).then(function (response) {
            const dataRes = JSON.parse(response?.data?.variables[2]?.value);
            const materi = dataRes?.data
            const responseCode = dataRes.code;
            setGetMateri(materi);
            if (responseCode == 200) {
                setLoading(false)
                setDataSuccess(true)
            } else {
                setDataSuccess(false)
                setCountRender(countRender + 1)
            }
        })
    }

    const _loadingData = () => {
        if (dataSuccess == false) {
            _getTugas()
        }
    }

    if (countRender > 1 && countRender < 4) {
        setInterval(_loadingData, 5000)
    }

    useEffect(() => {
       _getTugas()
    }, [academicYear])

    let history = useHistory();
    const handleRouter = (id, mapel, tugas) => {
        history.push(`/siswa-penilaian-${id}-${mapel}-${tugas}`)
    }

    const ViewPelajaran = () => {
        return (
            <div className="container px-3 py-4">
                <div className="row">
                    <div className="col-lg-12">
                        <PageHeader
                            className="mb-3 site-page-header card bg-lightblue text-grey-900 fw-700 "
                            onBack={() => window.history.back()}
                            title={`Data nilai / ${mapel}`}
                        />
                        <Card className="card bg-lightblue border-0 mb-4 text-grey-900">
                            <div className="row">
                                <div className="col-lg-8 col-md-6 my-2">
                                </div>
                                <div className="col-lg-4 col-md-6 my-2">
                                    <Search className="mr-3" placeholder="Cari kata kunci" allowClear
                                        onSearch={_onSearch} style={{ width: '80%' }} />
                                </div>
                            </div>
                        </Card>

                        <div className="px-1 py-2 ">
                            <Spin tip="Loading..." spinning={loading} className='mt-5'>
                            <div className="row">
                                {getMateri?.map((value, index) => {
                                    return (
                                        <div className="col-xl-3 col-lg-4 col-md-4">
                                            <div
                                                className="d-flex align-items-center justify-content-center card mb-4 d-block h150 w-100 shadow-md rounded-xl p-xxl-5 text-center"
                                                onClick={() => handleRouter(value.id, mapel, value.tittle)}
                                            >
                                                <h2 className="ml-auto mr-auto font-weight-bold mb-0">{value.tittle}</h2>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            </Spin>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Fragment>
            <div className="main-wrapper">
                <Navheader />
                <div className="main-content">
                    <Appheader />
                    <ViewPelajaran />
                    <Adminfooter />
                </div>
            </div>
        </Fragment>
    );
}