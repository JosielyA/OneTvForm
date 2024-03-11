import Axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import { FaPlus } from "react-icons/fa";
import OneTvLogo from "../assets/one tv logo.png";

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
        const res = Axios.post(`${serverurl}/formulario`, data);
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
      <div className="flex place-content-center m-10 mb-4">
        <img src={OneTvLogo} className="w-[250px]" />
      </div>
      <form
        onSubmit={(ev) => {
          submit(ev);
        }}
      >
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center p-3">
            <h1 className="text-2xl font-['Roboto'] font-semibold ">
              OneTvStudio
            </h1>
            <h2 className="text-xl font-semibold mb-3 font-['Roboto']">
              Formulario de pedidos
            </h2>
          </div>
          <div className="xl:w-4/12 w-6/12 ">
            <label className="text-black font-semibold  " htmlFor="nombre">
              Nombre
            </label>
          </div>
          <input
            onChange={(ev) => setNombre(ev.target.value)}
            className="xl:w-4/12 w-6/12 mb-1 py-1 px-3 border-turquesa border-b-4 border-x-[1px] rounded-lg font-semibold  text-turquesa placeholder-turquesa"
            type="text"
            name="nombre"
            placeholder="Nombre"
            required
          />
          <div className="xl:w-4/12 w-6/12 mb-1 ">
            <label className="text-black font-semibold " htmlFor="compania">
              Compañía
            </label>
          </div>
          <input
            onChange={(ev) => setCompania(ev.target.value)}
            className="xl:w-4/12 w-6/12 mb-1 py-1 px-3 border-turquesa border-b-4 border-x-[1px] rounded-lg font-semibold  text-turquesa placeholder-turquesa"
            type="text"
            name="compania"
            placeholder="Compañía"
            required
          />
          <div className="xl:w-4/12 w-6/12 mb-1 ">
            <label className="text-black font-semibold " htmlFor="correo">
              Correo
            </label>
          </div>
          <input
            onChange={(ev) => setCorreo(ev.target.value)}
            className="xl:w-4/12 w-6/12 mb-1 py-1 px-3 border-turquesa border-b-4 border-x-[1px] rounded-lg font-semibold  text-turquesa placeholder-turquesa"
            type="text"
            name="correo"
            placeholder="Correo"
            required
          />
          <div className="xl:w-4/12 w-6/12 ">
            <label className="text-black font-semibold " htmlFor="telefono">
              Teléfono
            </label>
          </div>
          <input
            onChange={(ev) => setTelefono(ev.target.value)}
            className="xl:w-4/12 w-6/12 py-1 px-3 border-turquesa border-b-4 border-x-[1px] rounded-lg font-semibold  text-turquesa placeholder-turquesa"
            type="text"
            name="telefono"
            placeholder="Teléfono"
            required
          />

          <div className="xl:w-4/12 w-6/12 flex flex-wrap items-center place-content-between mt-5">
            <h2 className="text-3xl font-semibold font-[Poppins]">Pedidos</h2>
            <button
              onClick={(e) => addPedido(e)}
              className="flex items-center border bg-celeste text-black rounded-sm font-bold text-md uppercase p-2 mx-2 disabled:opacity-50"
              disabled={loading}
            >
              <FaPlus className="mr-1" />
              <span>Agregar Pedido</span>
            </button>
          </div>
          <div className="p-4 xl:w-4/12 w-6/12">
            {pedidos.map((pedido, i) => (
              <div key={i}>
                <div className="w-full">
                  <h2 className="font-medium text-xl text-turquesa">
                    Pedido #{i + 1}
                  </h2>
                </div>
                <div className="flex flex-col  items-center bg-grisOscuro p-4 mb-4 rounded-lg">
                  <div className="w-full">
                    <label
                      className="text-black font-semibold "
                      htmlFor={`titulo_${i}`}
                    >
                      Título
                    </label>
                  </div>
                  <input
                    className="w-full py-1 px-3 border-turquesa border-b-4 border-x-[1px] my-2 rounded-lg bg-grisOscuro placeholder-turquesa font-semibold"
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
                      className="text-black font-semibold "
                      htmlFor={`descripcion_${i}`}
                    >
                      Descripción
                    </label>
                  </div>
                  <textarea
                    className="w-full mt-1 h-[100px] py-1 px-3 border-turquesa border-b-4 border-x-[1px] mb-2 rounded-lg bg-grisOscuro placeholder-turquesa font-semibold"
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
                      className="text-black font-semibold "
                      htmlFor={`imagenes_${i}`}
                    >
                      Imagenes
                    </label>
                  </div>
                  <input
                    className="md:p-4 w-full mt-1 border-turquesa border-2 border-dashed mb-2 rounded-md bg-grisClaro"
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
                className="bg-celeste text-black font-bold text-2xl py-2 px-16 rounded-sm mx-2 disabled:opacity-50"
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
