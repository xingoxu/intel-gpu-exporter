const http = require("http");
const { spawn } = require("node:child_process");

// const host = '0.0.0.0';
const port = 8080;

let gpuStatics = {};
const intel_gpu_top = spawn("intel_gpu_top", ["-J"]);

// there's a ',' on first letter
intel_gpu_top.stdout.on("data", (data) => {
  gpuStatics = JSON.parse(data.toString().slice(1));
});

intel_gpu_top.on("close", (code) => {
  process.exit(code);
});
const getRenderValue = () => {
  if (gpuStatics.engines["Render/3D/0"] !== undefined) {
    return gpuStatics.engines["Render/3D/0"].busy;
  } else if (gpuStatics.engines["Render/3D"] !== undefined) {
    return gpuStatics.engines["Render/3D"].busy;
  }
  return 0;
};

const getBlitterValue = () => {
  if (gpuStatics.engines["Blitter/0"] !== undefined) {
    return gpuStatics.engines["Blitter/0"].busy;
  } else if (gpuStatics.engines["Blitter"] !== undefined) {
    return gpuStatics.engines["Blitter"].busy;
  }
  return 0;
};

const getVideoValue = () => {
  if (gpuStatics.engines["Video/0"] !== undefined) {
    return gpuStatics.engines["Video/0"].busy;
  } else if (gpuStatics.engines["Video"] !== undefined) {
    return gpuStatics.engines["Video"].busy;
  }
  return 0;
};

const getEnhanceValue = () => {
  if (gpuStatics.engines["VideoEnhance/0"] !== undefined) {
    return gpuStatics.engines["VideoEnhance/0"].busy;
  } else if (gpuStatics.engines["VideoEnhance"] !== undefined) {
    return gpuStatics.engines["VideoEnhance"].busy;
  }
  return 0;
};

const requestListener = function (req, res) {
  res.writeHead(200);
  switch (req.url) {
    case "/metrics":
      res.end(`# HELP intel_gpu_render_busy_percent Render busy utilisation in %
# TYPE intel_gpu_render_busy_percent summary
intel_gpu_render_busy_percent ${getRenderValue()}
# HELP intel_gpu_blitter_busy_percent Blitter busy utilisation in %
# TYPE intel_gpu_blitter_busy_percent summary
intel_gpu_blitter_busy_percent ${getBlitterValue()}
# HELP intel_gpu_video_busy_percent Video busy utilisation in %
# TYPE intel_gpu_video_busy_percent summary
intel_gpu_video_busy_percent ${getVideoValue()}
# HELP intel_gpu_enhance_busy_percent Enhance busy utilisation in %
# TYPE intel_gpu_enhance_busy_percent summary
intel_gpu_enhance_busy_percent ${getEnhanceValue()}`);
      break;
    default:
      res.end("Hello World!");
  }
};

const server = http.createServer(requestListener);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
