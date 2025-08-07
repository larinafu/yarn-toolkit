export default function Tutorial({}) {
  return (
    <div className="flex">
      <div>
        <h2>Table of Contents</h2>
      </div>
      <div>
        <h1 className="text-5xl mb-2">
          Guide to Using the Knitting Chart Editor
        </h1>
        <h2>Confused about how to work the editor? </h2>
        <section>
          <h3>Moving around the chart</h3>
          <p>
            Use the yellow rectangle within the viewbox (top right) to navigate
            to a different part of the knitting chart.
          </p>
          <video
            src="/gifs/grid-move-demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            width="480"
          />
        </section>
        <section>
          <h3>Adding or Deleting Rows or Columns</h3>
          <p>
            Clicking on a row or column number gives you the option to delete
            that row or{" "}
          </p>
          <video
            src="/gifs/grid-move-demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            width="480"
          />
        </section>
      </div>
    </div>
  );
}
