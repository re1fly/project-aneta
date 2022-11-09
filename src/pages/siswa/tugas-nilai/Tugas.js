import React, { Fragment, useState, useEffect } from "react"
import {
    Card,
    PageHeader
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
    const [grid, setGrid] = useState(false)
    const [getMateri, setGetMateri] = useState([]);

    const userId = localStorage.getItem('user_id');
    const academicYear = localStorage.getItem('academic_id')
    const instituteId = localStorage.getItem('institute')

    const params = useParams()
    const idMapel = params.id

    const _onSearch = value => console.log(value);

    useEffect(() => {
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
            setGetMateri(materi);
        })
    }, [academicYear])

    let history = useHistory();
    const handleRouter = (id) => {
        console.log(id);
        history.push(`/siswa-penilaian-${id}`)
    }

    const ViewPelajaran = () => {
        return (
            <div className="container px-3 py-4">
                <div className="row">
                    <div className="col-lg-12">
                        <PageHeader
                            className="mb-3 site-page-header card bg-lightblue text-grey-900 fw-700 "
                            onBack={() => window.history.back()}
                            title="Data Tugas"
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
                            <div className="row">
                                {getMateri?.map((value, index) => {
                                    return (
                                        <div className="col-xl-3 col-lg-4 col-md-4">
                                            <div
                                                className="card mb-4 d-block h150 w-100 shadow-md rounded-xl p-xxl-5 pt-3 text-center"
                                                onClick={() => handleRouter(value.id)}
                                            >
                                                <h2 className="ml-auto mr-auto font-weight-bold mt-5 mb-0">{value.tittle}</h2>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
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