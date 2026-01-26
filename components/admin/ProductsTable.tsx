"use client";

import { useState, useRef } from "react";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from "@/actions/admin";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

// --- Types ---

interface ProductVariation {
  id: string;
  name: string;
  image_url: string;
  product_id?: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  active: boolean;
  _count: { orders: number };
  variations: ProductVariation[];
}

interface ProductsTableProps {
  products: Product[];
}

interface VariationFormData {
  id?: string;
  name: string;
  image_url: string;
}

// --- Upload Component ---

function ImageUploader({
  value,
  onChange,
  label = "Image",
  productId,
}: {
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
  productId?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // Use product upload endpoint if productId is provided
      let endpoint = "/api/upload/image";
      if (productId) {
        endpoint = "/api/upload/product";
        formData.append("productId", productId);
      }

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onChange(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
          ) : value ? (
            <Image src={value} alt="Preview" fill className="object-cover" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-300" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading
              ? "Uploading..."
              : value
                ? "Change Image"
                : "Upload Image"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onChange("")}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function ProductsTable({ products }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected product
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Temp ID for new products (used for organizing uploads before product is created)
  const [tempProductId] = useState(() => `temp-${Date.now()}`);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    image_url: "",
    active: true,
  });

  const [variations, setVariations] = useState<VariationFormData[]>([]);

  // Helpers
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      base_price: "",
      image_url: "",
      active: true,
    });
    setVariations([]);
    setSelectedProduct(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      base_price: product.base_price.toString(),
      image_url: product.image_url || "",
      active: product.active,
    });
    setVariations(
      product.variations.map((v) => ({
        id: v.id,
        name: v.name,
        image_url: v.image_url,
      })),
    );
    setIsModalOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // --- Variation Handlers ---

  const addVariation = () => {
    setVariations([...variations, { name: "", image_url: "" }]);
  };

  const updateVariation = (
    index: number,
    field: keyof VariationFormData,
    value: string,
  ) => {
    const newVars = [...variations];
    newVars[index] = { ...newVars[index], [field]: value };
    setVariations(newVars);
  };

  const removeVariation = (index: number) => {
    const newVars = [...variations];
    newVars.splice(index, 1);
    setVariations(newVars);
  };

  // --- Submit ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate variations
      const validVariations = variations.filter((v) => v.name.trim() !== "");

      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        base_price: parseFloat(formData.base_price),
        image_url: formData.image_url || undefined,
        active: formData.active,
        variations: validVariations,
      };

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      await deleteProduct(selectedProduct.id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    await toggleProductStatus(product.id, product.active);
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 font-medium border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 w-20">Image</th>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3 text-center">Variations</th>
                <th className="px-6 py-3 text-center">Active</th>
                <th className="px-6 py-3 text-center">Orders</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 relative">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {product.base_price.toFixed(2)} ETB
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {product.variations?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={cn(
                          "w-9 h-5 rounded-full p-0.5 transition-colors relative",
                          product.active ? "bg-teal-500" : "bg-gray-200",
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                            product.active ? "translate-x-4" : "translate-x-0",
                          )}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product._count.orders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(product)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? "Edit Product" : "New Product"}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">
              Basic Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Business Card"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price (ETB)
                </label>
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) =>
                    setFormData({ ...formData, base_price: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-gray-300"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                  />
                  <span className="text-sm text-gray-700">
                    Available for Order
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Product details..."
                rows={2}
              />
            </div>

            <ImageUploader
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              productId={selectedProduct?.id || tempProductId}
            />
          </div>

          {/* Variations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Variations
              </h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addVariation}
                className="h-8"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Variant
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {variations.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4 italic">
                  No variations added yet.
                </p>
              )}
              {variations.map((v, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 items-start"
                >
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="Variant Name (e.g. Size A4)"
                      value={v.name}
                      onChange={(e) =>
                        updateVariation(index, "name", e.target.value)
                      }
                      className="bg-white"
                    />
                    <ImageUploader
                      label="Variant Image"
                      value={v.image_url}
                      onChange={(url) =>
                        updateVariation(index, "image_url", url)
                      }
                      productId={selectedProduct?.id || tempProductId}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariation(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {selectedProduct ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">
              {selectedProduct?.name}
            </span>
            ? This action cannot be undone and may affect existing orders linked
            to this product.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
