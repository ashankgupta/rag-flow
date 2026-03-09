from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseNode(ABC):
    def __init__(self, config: Dict[str, Any]):
        self.config = config

    @abstractmethod
    def run(self, input_data: Any) -> Any:
        """
        Every node follows:
        input -> logic -> output
        """
        pass
