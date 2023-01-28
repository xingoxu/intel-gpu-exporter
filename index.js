const http = require('http');
const { spawn } = require('node:child_process');

// const host = '0.0.0.0';
const port = 8080;

let gpuStatics = {};
const intel_gpu_top = spawn('intel_gpu_top', ['-J'])


// there's a ',' on first letter
intel_gpu_top.stdout.on('data', (data) => {
  gpuStatics = JSON.parse(data.toString().slice(1));
})

intel_gpu_top.on('close', (code) => {
  process.exit(code);
})

const requestListener = function (req, res) {
  res.writeHead(200);
  switch (req.url) {
    case '/metrics':
      res.end(`# HELP intel_gpu_render_busy_percent Render busy utilisation in %
# TYPE intel_gpu_render_busy_percent summary
intel_gpu_render_busy_percent ${gpuStatics["engines"]["Render/3D/0"]["busy"]}
# HELP intel_gpu_video_busy_percent Video busy utilisation in %
# TYPE intel_gpu_video_busy_percent summary
intel_gpu_video_busy_percent ${gpuStatics["engines"]["Video/0"]["busy"]}
# HELP intel_gpu_enhance_busy_percent Enhance busy utilisation in %
# TYPE intel_gpu_enhance_busy_percent summary
intel_gpu_enhance_busy_percent ${gpuStatics["engines"]["VideoEnhance/0"]["busy"]}`);
      break;
    default:
      res.end("Hello World!");
  }
};

const server = http.createServer(requestListener);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

