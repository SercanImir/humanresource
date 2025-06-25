import React, { useState } from "react";

export const CompanyTestInput: React.FC = () => {
    const [state, setState] = useState({ taxNo: "", name: "" });
    const [edit, setEdit] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div style={{ maxWidth: 400, margin: "100px auto" }}>
            <button onClick={() => setEdit(e => !e)}>{edit ? "Vazgeç" : "Düzenle"}</button>
            {edit ? (
                <>
                    <input
                        name="name"
                        value={state.name}
                        onChange={handleChange}
                        placeholder="Şirket Adı"
                        className="form-control my-2"
                    />
                    <input
                        name="taxNo"
                        value={state.taxNo}
                        onChange={handleChange}
                        placeholder="Vergi No"
                        className="form-control my-2"
                    />
                </>
            ) : (
                <div>
                    <div>Şirket Adı: {state.name}</div>
                    <div>Vergi No: {state.taxNo}</div>
                </div>
            )}
        </div>
    );
};
