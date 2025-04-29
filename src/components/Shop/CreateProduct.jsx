import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [error, success, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      shopId: seller?._id,
      images,
    };

    dispatch(createProduct(productData));
  };

  return (
    <div className="w-[95%] max-w-[600px] mx-auto mt-10 p-8 bg-white rounded-2xl shadow-md overflow-y-auto">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">Product Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">Description <span className="text-red-500">*</span></label>
          <textarea
            rows="6"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">Category <span className="text-red-500">*</span></label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a category</option>
            {categoriesData.map((item, index) => (
              <option value={item.title} key={index}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter product tags"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Prices */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-600 mb-2 font-medium">Original Price</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Original price"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex-1">
            <label className="block text-gray-600 mb-2 font-medium">Discounted Price <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Discounted price"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">Stock <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter available stock"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Upload Images */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">Upload Images <span className="text-red-500">*</span></label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <label htmlFor="upload" className="flex items-center gap-2 text-blue-500 cursor-pointer hover:text-blue-700">
            <AiOutlinePlusCircle size={24} />
            <span>Upload Images</span>
          </label>

          {/* Images Preview */}
          <div className="flex flex-wrap gap-3 mt-3">
            {images.map((img, idx) => (
              <img
                src={img}
                key={idx}
                alt="Uploaded"
                className="h-[100px] w-[100px] object-contain rounded-md border"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
