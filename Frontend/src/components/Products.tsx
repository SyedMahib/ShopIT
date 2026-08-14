import ProductGrid from "./ProductGrid";
import { useGetProductsQuery } from "../store/productsApi";
import type { ProductsQueryParams } from "../store/productsApi";

interface ProductsProps {
  params?: ProductsQueryParams;
  perPage?: number;
  title?: string;
}

const Products = ({ params, perPage = 4, title }: ProductsProps) => {
  const queryArg: ProductsQueryParams = { ...(params || {}), limit: perPage };
  const { data, error, isLoading, isFetching } = useGetProductsQuery(queryArg);

  const products = data?.products || [];
  const errMsg = (error as any)?.data?.message || (error as any)?.error || null;

  return (
    <div>
      {title && (
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}
      <ProductGrid
        products={products}
        loading={isLoading && !data}
        refreshing={isFetching && Boolean(data)}
        skeletonCount={perPage}
        error={errMsg}
      />
    </div>
  );
};

export default Products;
