import Axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import { FaPlus } from "react-icons/fa";

function IndexPage() {
  const serverurl =
    "https://onetvformback.netlify.app/.netlify/functions/server/api";
  const [pedidos, setPedidos] = useState([
    { titulo: "", descripcion: "", imagenes: [] },
  ]);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [compania, setCompania] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [imagesChanged, setImagesChanged] = useState(false);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const addPedido = (e) => {
    e.preventDefault();
    setPedidos([...pedidos, { titulo: "", descripcion: "", imagenes: [] }]);
  };
  let filtro;

  const handleImages = async (e, index) => {
    setImagesChanged(false);
    const files = e.currentTarget.files;
    Object.keys(files).forEach(async (i) => {
      setImagesChanged(false);
      const file = files[i];
      let url = URL.createObjectURL(file);
      const base64 = await convertBase64(file);

      pedidos[index].imagenes.push({
        name: file.name,
        url,
        file: base64,
      });
      setImagesChanged(true);
    });
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const submit = async (ev) => {
    ev.preventDefault();

    toast("Enviando...", {
      icon: "🚀",
    });

    pedidos.forEach((pedido, i) => {
      let pedido_titulo = pedido.titulo;
      let pedido_descripcion = pedido.descripcion;
      let pedido_imagenes = [];
      for (let i = 0; i < pedido.imagenes.length; i++) {
        pedido_imagenes.push(pedido.imagenes[i].file);
      }

      const data = {
        nombre,
        compania,
        telefono,
        correo,
        pedido_titulo,
        pedido_descripcion,
        pedido_imagenes,
      };
      try {
        res = Axios.post(`${serverurl}/formulario`, data);
        console.log(res);

        toast.success(`Pedido #${i + 1} enviado.`);

        if (i == pedidos.length - 1) {
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        console.log(error);
        toast.error(`Error, pedido #${i + 1} no se pudo enviar.`);
        setLoading((prev) => !prev);
      }
      setLoading((prev) => !prev);
    });
  };

  return (
    <div>
      <div
        className={`absolute h-[10000px] w-full bg-slate-700 opacity-50 flex place-content-center ${
          loading ? "visible" : "hidden"
        }`}
      >
        <div className="h-screen flex items-center">
          <PulseLoader
            color="#0019ff"
            cssOverride={override}
            size={70}
            margin={10}
          />
        </div>
      </div>
      <form
        onSubmit={(ev) => {
          submit(ev);
        }}
      >
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center p-3">
            <h1 className="text-3xl font-bold ">OneTvStudio</h1>
            <h2 className="text-2xl font-bold mb-3">Formulario de Pedidos</h2>
          </div>
          <div className="xl:w-4/12 w-6/12 ">
            <label className="text-black font-bold" htmlFor="nombre">
              Nombre
            </label>
          </div>
          <input
            onChange={(ev) => setNombre(ev.target.value)}
            className="xl:w-4/12 w-6/12 mb-1 p-1 border-blue-800 border-b-4 border-x-[1px] rounded-md placeholder-slate-600 font-semibold"
            type="text"
            name="nombre"
            placeholder="Nombre"
            required
          />
          <div className="xl:w-4/12 w-6/12 mb-1 ">
            <label className="text-black font-bold" htmlFor="compania">
              Compañía
            </label>
          </div>
          <input
            onChange={(ev) => setCompania(ev.target.value)}
            className="xl:w-4/12 w-6/12 mb-1 p-1 border-blue-800 border-b-4 border-x-[1px] rounded-md placeholder-slate-600 font-semibold"
            type="text"
            name="compania"
            placeholder="Compañía"
            required
          />
          <div className="xl:w-4/12 w-6/12 mb-1 ">
            <label className="text-black font-bold" htmlFor="correo">
              Correo
            </label>
          </div>
          <input
            onChange={(ev) => setCorreo(ev.target.value)}
            className="xl:w-4/12 w-6/12 mb-1 p-1 border-blue-800 border-b-4 border-x-[1px] rounded-md placeholder-slate-600 font-semibold"
            type="text"
            name="correo"
            placeholder="Correo"
            required
          />
          <div className="xl:w-4/12 w-6/12 ">
            <label className="text-black font-bold" htmlFor="telefono">
              Teléfono
            </label>
          </div>
          <input
            onChange={(ev) => setTelefono(ev.target.value)}
            className="xl:w-4/12 w-6/12 p-1 border-blue-800 border-b-4 border-x-[1px] rounded-md placeholder-slate-600 font-semibold"
            type="text"
            name="telefono"
            placeholder="Teléfono"
            required
          />
          <h2 className="text-2xl font-bold">Pedidos</h2>
          <div className="xl:w-4/12 w-7/12 flex items-center place-content-end">
            <button
              onClick={(e) => addPedido(e)}
              className="absolute mt-10 mr-4 flex items-center border bg-blue-800 rounded-sm text-white font-bold text-md uppercase p-2 mx-2 disabled:opacity-50"
              disabled={loading}
            >
              <FaPlus className="mr-1" />
              <span>Agregar Pedido</span>
            </button>
          </div>
          <div className="p-4 xl:w-4/12 w-7/12">
            {pedidos.map((pedido, i) => (
              <div key={i}>
                <div className="w-full">
                  <h2 className="font-bold text-xl">Pedido #{i + 1}</h2>
                </div>
                <div className="flex flex-col  items-center bg-gray-400 p-4 mb-4 rounded-md">
                  <div className="w-full">
                    <label
                      className="text-black font-bold"
                      htmlFor={`titulo_${i}`}
                    >
                      Título
                    </label>
                  </div>
                  <input
                    className="w-full p-1 border-blue-800 border-b-4 border-x-[1px] my-2 rounded-md bg-gray-400 placeholder-slate-700 font-semibold"
                    type="text"
                    name={`titulo_${i}`}
                    placeholder="Título"
                    onChange={(ev) => {
                      pedido.titulo = ev.target.value;
                    }}
                    required
                  />
                  <div className="w-full">
                    <label
                      className="text-black font-bold"
                      htmlFor={`descripcion_${i}`}
                    >
                      Descripción
                    </label>
                  </div>
                  <textarea
                    className="w-full mt-1 h-[100px] p-1 border-blue-800 border-b-4 border-x-[1px] mb-2 rounded-md bg-gray-400 placeholder-slate-700 font-semibold"
                    type="text"
                    name={`descripcion_${i}`}
                    onChange={(ev) => {
                      pedido.descripcion = ev.target.value;
                    }}
                    placeholder="Descripción"
                    required
                  />
                  <div className="w-full">
                    <label
                      className="text-black font-bold"
                      htmlFor={`imagenes_${i}`}
                    >
                      Imagenes
                    </label>
                  </div>
                  <input
                    className="p-4 mt-1 border-blue-800 border-2 border-dashed mb-2 rounded-md bg-gray-300"
                    type="file"
                    name={`imagenes_${i}`}
                    multiple
                    onChange={(ev) => {
                      handleImages(ev, i);
                    }}
                  />
                  <div className="flex flex-wrap">
                    {pedido &&
                    pedido.imagenes.length > 0 &&
                    (imagesChanged == false || imagesChanged == true) ? (
                      pedido.imagenes.map((imagen, i) => (
                        <img className="size-20" key={i} src={imagen.url}></img>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex place-content-center">
              <button
                className="bg-blue-800 text-white font-bold text-2xl py-2 px-16 rounded-sm mx-2 disabled:opacity-50"
                disabled={loading}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default IndexPage;
