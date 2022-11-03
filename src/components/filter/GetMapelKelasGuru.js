import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClassByAcademic } from "./ClassByAcademic";
import { MapelByAcademic } from "./MapelByAcademic";
import { global_join_sub_where_get, url_by_institute } from "../../api/reference";

export const GetMapelKelasGuru = (props) => {
    const academic = localStorage.getItem("academic_year");
    const userId = localStorage.getItem("user_id")
    const [dataClass, setDataClass] = useState([]);
    const [dataMapel, setDataMapel] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null)

    const _getDataKelas = () => {
        axios
            .post(
                url_by_institute,
                {
                    "processDefinitionId": "rolegurugetsubclass:1:cf6435fc-4a0b-11ed-8f22-927b5be84510",
                    "returnVariables": true,
                    "variables": [
                        {
                            "name": "get_sub_kelas_guru",
                            "type": "json",
                            "value": {
                                "user_id": userId
                            }
                        }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic YWRtaW46TWFuYWczciE="
                    },
                }
            )
            .then(function (response) {
                const dataKelas = JSON.parse(response.data.variables[2].value);
                setDataClass(dataKelas.data);
            })
    }
    const _getDataMapel = () => {
        axios
            .post(
                url_by_institute,
                {
                    "processDefinitionId": "rolegurugetmatpel:1:0328ed1e-4a0c-11ed-8f22-927b5be84510",
                    "returnVariables": true,
                    "variables": [
                        {
                            "name": "update_jadwal_pelajaran",
                            "type": "json",
                            "value": {
                                "user_id": userId,
                                "id_class": selectedClass
                            }
                        }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic YWRtaW46TWFuYWczciE="
                    },
                }
            )
            .then(function (response) {
                const dataMapelApi = JSON.parse(response.data.variables[2].value);
                const getMapel = dataMapelApi.data

                setDataMapel(getMapel);
            })
    }

    useEffect(() => {
        _getDataKelas()
    }, []);

    useEffect(() => {
        _getDataMapel()
    }, [selectedClass]);

    return (
        <>
            <form onSubmit={props.valueFilter}
                method="POST">
                <div className="row">
                    <div className="col-lg-4 mb-3">
                        <ClassByAcademic
                            onChangeKelas={(e) => setSelectedClass(e.target.value)}
                            selectKelas={dataClass.map((data) => (
                                <option value={data.id}>{data.class_type} / {data.sub_class}</option>
                            ))}
                        />
                    </div>
                    <div className="col-lg-4 mb-3">
                        <MapelByAcademic selectMapel={dataMapel == null ? null : dataMapel.map((data) => (
                            <option value={data.id}>{data.nama_mata}</option>
                        ))} />
                    </div>
                    <div className="col-lg-4 mb-3">
                        <button
                            className="bg-primary border-0 text-center text-white font-xsss mt-2 fw-600 p-2 w-25 rounded-lg"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

