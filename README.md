# laoyangshuo-llm

Some research building a copilot for my blogs base on llm.

## run chroma local

```bash
sudo docker run -d --name chromadb --privileged=true -p 8000:8000 -e IS_PERSISTENT=TRUE -e ANONYMIZED_TELEMETRY=FALSE chromadb/chroma:latest
```