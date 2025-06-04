import Spinner from "../spinner/spinner";

export default function LoadingBackground() {
  return (
    <div className="flex w-screen h-screen absolute justify-center items-center">
      <div className={`p-2 bg-amaranth rounded-full`}>
        <Spinner color="#fff" isSpinning />
      </div>
    </div>
  );
}
