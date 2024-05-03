# intel-gpu-exporter

Get metrics from Intel GPUs for Prometheus metrics

## Deployment

Runs on port 8080, does stuff, is hyperglued using nodejs and intel_gpu_top

## Metrics

```bash
# HELP intel_gpu_render_busy_percent Render busy utilisation in %
# TYPE intel_gpu_render_busy_percent summary
intel_gpu_render_busy_percent 8.034614
# HELP intel_gpu_video_busy_percent Video busy utilisation in %
# TYPE intel_gpu_video_busy_percent summary
intel_gpu_video_busy_percent 3.528983
# HELP intel_gpu_enhance_busy_percent Enhance busy utilisation in %
# TYPE intel_gpu_enhance_busy_percent summary
intel_gpu_enhance_busy_percent 0.0
```
