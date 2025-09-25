import Viaticos from "./viaticos.model.js";
import { uploadBufferToCloudinary, uploadBase64ToCloudinary, deleteFromCloudinary } from "../../middleware/cloudinaryUpload.js";

export const createViaticos = async (req, res) => {
  try {
    console.log("=== INICIO createViaticos ===");
    const viaticosData = { ...req.body };

    let fotosUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadBufferToCloudinary(file.buffer, "viaticos/fotos");
        fotosUrls.push(result.secure_url);
      }
    }

    if (viaticosData.Movilizacion && typeof viaticosData.Movilizacion === "string") {
      viaticosData.Movilizacion = JSON.parse(viaticosData.Movilizacion);
    }

    if (viaticosData.firma && viaticosData.firma.startsWith('data:image')) {
      try {
        const firmaResult = await uploadBase64ToCloudinary(viaticosData.firma, "viaticos/firmas");
        viaticosData.Firma = firmaResult.secure_url;
        console.log("✅ Firma subida a Cloudinary");
      } catch (error) {
        console.error("❌ Error subiendo firma a Cloudinary:", error);
        viaticosData.Firma = viaticosData.firma;
      }
    } else if (viaticosData.firma) {
      viaticosData.Firma = viaticosData.firma;
    }

    if (viaticosData.Movilizacion && typeof viaticosData.Movilizacion === "string") {
      viaticosData.Movilizacion = JSON.parse(viaticosData.Movilizacion);
    }
    if (viaticosData.Hospedaje && typeof viaticosData.Hospedaje === "string") {
      viaticosData.Hospedaje = JSON.parse(viaticosData.Hospedaje);
    }
    if (viaticosData.Comida && typeof viaticosData.Comida === "string") {
      viaticosData.Comida = JSON.parse(viaticosData.Comida);
    }

    viaticosData.Fotos = fotosUrls;
    delete viaticosData.firma;

    const newViaticos = new Viaticos(viaticosData);
    await newViaticos.save();

    res.status(201).json({
      success: true,
      message: "Viático creado exitosamente",
      data: newViaticos,
    });
  } catch (error) {
    console.error("❌ Error en createViaticos:", error);
    res.status(500).json({
      success: false,
      message: "Error creando viático",
      error: error.message,
    });
  }
};

export const obtenerViaticos = async (req, res) => {
  try {
    const viaticos = await Viaticos.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: viaticos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo viáticos",
      error: error.message,
    });
  }
};


export const obtenerViaticoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const viatico = await Viaticos.findById(id);
    
    if (!viatico) {
      return res.status(404).json({
        success: false,
        message: "Viático no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: viatico,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo viático",
      error: error.message,
    });
  }
};

export const actualizarViatico = async (req, res) => {
  try {
    const { id } = req.params;
    const viaticosData = { ...req.body };

    const viaticoExistente = await Viaticos.findById(id);
    
    if (!viaticoExistente) {
      return res.status(404).json({
        success: false,
        message: "Viático no encontrado",
      });
    }

    if (viaticosData.Movilizacion && typeof viaticosData.Movilizacion === "string") {
      viaticosData.Movilizacion = JSON.parse(viaticosData.Movilizacion);
    }

    let fotosUrls = [];

    if (viaticosData.fotosExistentes) {
      try {
        const fotosExistentes = JSON.parse(viaticosData.fotosExistentes);
        fotosUrls = fotosExistentes;
        console.log("✅ Fotos existentes actualizadas:", fotosUrls.length);
      } catch (error) {
        console.error("❌ Error parseando fotos existentes:", error);
        fotosUrls = [...viaticoExistente.Fotos];
      }
    } else {
      fotosUrls = [...viaticoExistente.Fotos];
    }

    const fotosAEliminar = viaticoExistente.Fotos.filter(foto => 
      !fotosUrls.includes(foto)
    );

    for (const fotoUrl of fotosAEliminar) {
      if (fotoUrl.includes('cloudinary.com')) {
        try {
          const publicId = fotoUrl.split('/').pop().split('.')[0];
          await deleteFromCloudinary(`viaticos/fotos/${publicId}`);
          console.log("🗑️ Foto eliminada de Cloudinary:", publicId);
        } catch (cloudinaryError) {
          console.error("⚠️ Error eliminando foto de Cloudinary:", cloudinaryError);
        }
      }
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadBufferToCloudinary(file.buffer, "viaticos/fotos");
        fotosUrls.push(result.secure_url);
      }
      fotosUrls = fotosUrls.slice(-5);
    }

    if (viaticosData.firma && viaticosData.firma.startsWith('data:image')) {
      try {
        if (viaticoExistente.Firma && viaticoExistente.Firma.includes('cloudinary.com')) {
          const publicId = viaticoExistente.Firma.split('/').pop().split('.')[0];
          await deleteFromCloudinary(`viaticos/firmas/${publicId}`);
        }
        
        const firmaResult = await uploadBase64ToCloudinary(viaticosData.firma, "viaticos/firmas");
        viaticosData.Firma = firmaResult.secure_url;
      } catch (error) {
        console.error("❌ Error actualizando firma:", error);
        viaticosData.Firma = viaticosData.firma;
      }
    } else if (viaticosData.firma === '') {
      if (viaticoExistente.Firma && viaticoExistente.Firma.includes('cloudinary.com')) {
        const publicId = viaticoExistente.Firma.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`viaticos/firmas/${publicId}`);
      }
      viaticosData.Firma = '';
    }

    if (viaticosData.Movilizacion && typeof viaticosData.Movilizacion === "string") {
      viaticosData.Movilizacion = JSON.parse(viaticosData.Movilizacion);
    }
    if (viaticosData.Hospedaje && typeof viaticosData.Hospedaje === "string") {
      viaticosData.Hospedaje = JSON.parse(viaticosData.Hospedaje);
    }
    if (viaticosData.Comida && typeof viaticosData.Comida === "string") {
      viaticosData.Comida = JSON.parse(viaticosData.Comida);
    }

    viaticosData.Fotos = fotosUrls;
    delete viaticosData.firma;
    delete viaticosData.fotosExistentes; 

    const viaticoActualizado = await Viaticos.findByIdAndUpdate(
      id,
      viaticosData,
      { new: true, runValidators: true }
    );

    viaticoActualizado.Montogastado = (viaticoActualizado.Movilizacion?.monto || 0) + 
                                      (viaticoActualizado.Hospedaje?.monto || 0) + 
                                      (viaticoActualizado.Comida?.monto || 0);
    await viaticoActualizado.save();

    res.status(200).json({
      success: true,
      message: "Viático actualizado exitosamente",
      data: viaticoActualizado,
    });
  } catch (error) {
    console.error("❌ Error en actualizarViatico:", error);
    res.status(500).json({
      success: false,
      message: "Error actualizando viático",
      error: error.message,
    });
  }
};

export const eliminarViatico = async (req, res) => {
  try {
    const { id } = req.params;

    const viatico = await Viaticos.findById(id);
    
    if (!viatico) {
      return res.status(404).json({
        success: false,
        message: "Viático no encontrado",
      });
    }

    try {
      if (viatico.Fotos && viatico.Fotos.length > 0) {
        for (const fotoUrl of viatico.Fotos) {
          if (fotoUrl.includes('cloudinary.com')) {
            const publicId = fotoUrl.split('/').pop().split('.')[0];
            await deleteFromCloudinary(`viaticos/fotos/${publicId}`);
          }
        }
      }

      if (viatico.Firma && viatico.Firma.includes('cloudinary.com')) {
        const publicId = viatico.Firma.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`viaticos/firmas/${publicId}`);
      }
    } catch (cloudinaryError) {
      console.error("⚠️ Error eliminando archivos de Cloudinary:", cloudinaryError);
    }

    await Viaticos.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Viático eliminado exitosamente",
      data: { id },
    });
  } catch (error) {
    console.error("❌ Error en eliminarViatico:", error);
    res.status(500).json({
      success: false,
      message: "Error eliminando viático",
      error: error.message,
    });
  }
};

export const eliminarFotoViatico = async (req, res) => {
  try {
    const { id, fotoIndex } = req.params;

    const viatico = await Viaticos.findById(id);
    
    if (!viatico) {
      return res.status(404).json({
        success: false,
        message: "Viático no encontrado",
      });
    }

    if (!viatico.Fotos || viatico.Fotos.length <= fotoIndex) {
      return res.status(404).json({
        success: false,
        message: "Foto no encontrada",
      });
    }

    const fotoUrl = viatico.Fotos[fotoIndex];

    if (fotoUrl.includes('cloudinary.com')) {
      const publicId = fotoUrl.split('/').pop().split('.')[0];
      await deleteFromCloudinary(`viaticos/fotos/${publicId}`);
    }

    viatico.Fotos.splice(fotoIndex, 1);
    await viatico.save();

    res.status(200).json({
      success: true,
      message: "Foto eliminada exitosamente",
      data: viatico,
    });
  } catch (error) {
    console.error("❌ Error en eliminarFotoViatico:", error);
    res.status(500).json({
      success: false,
      message: "Error eliminando foto",
      error: error.message,
    });
  }
};